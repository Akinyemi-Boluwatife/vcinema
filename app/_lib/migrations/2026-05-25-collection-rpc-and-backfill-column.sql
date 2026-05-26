-- Run manually in Supabase SQL editor.
--
-- Adds two transactional RPCs that replace the racy app-level reads/writes for
-- collection_items, plus a backfill-attempt timestamp on watched_movies so the
-- OMDb metadata backfill stops re-running on every read.
--
-- Verify column types before applying:
--   collections.id, collections.user_id, collection_items.collection_id, watched_movies.user_id  -> uuid
--   collection_items.imdb_id, watched_movies.imdb_id, collection_items.year                       -> text
--   collection_items.position                                                                     -> int4

-- 1. Atomic add: ownership-checked, computes next position inside the txn.
create or replace function public.collection_add_item(
  p_collection_id uuid,
  p_imdb_id       text,
  p_title         text,
  p_poster        text,
  p_year          text
)
returns boolean
language plpgsql
security invoker
as $$
declare
  v_owner uuid;
  v_pos   int;
  v_added boolean := true;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select user_id into v_owner
    from public.collections
   where id = p_collection_id;

  if v_owner is null or v_owner <> auth.uid() then
    raise exception 'Not found' using errcode = 'P0002';
  end if;

  select coalesce(max(position) + 1, 0) into v_pos
    from public.collection_items
   where collection_id = p_collection_id;

  begin
    insert into public.collection_items
      (collection_id, imdb_id, title, poster, year, position)
    values
      (p_collection_id, p_imdb_id, p_title, p_poster, p_year, v_pos);
  exception when unique_violation then
    v_added := false;
  end;

  update public.collections
     set updated_at = now()
   where id = p_collection_id;

  return v_added;
end;
$$;

grant execute on function public.collection_add_item(uuid, text, text, text, text)
  to authenticated;

-- 2. Atomic reorder: ownership-checked, all updates in one txn.
create or replace function public.collection_reorder(
  p_collection_id    uuid,
  p_ordered_imdb_ids text[]
)
returns void
language plpgsql
security invoker
as $$
declare
  v_owner uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select user_id into v_owner
    from public.collections
   where id = p_collection_id;

  if v_owner is null or v_owner <> auth.uid() then
    raise exception 'Not found' using errcode = 'P0002';
  end if;

  update public.collection_items as ci
     set position = ord.idx - 1
    from unnest(p_ordered_imdb_ids) with ordinality as ord(imdb_id, idx)
   where ci.collection_id = p_collection_id
     and ci.imdb_id = ord.imdb_id;

  update public.collections
     set updated_at = now()
   where id = p_collection_id;
end;
$$;

grant execute on function public.collection_reorder(uuid, text[])
  to authenticated;

-- 3. Backfill-attempt timestamp on watched_movies.
--    Gates the OMDb metadata backfill so we don't re-fetch the same rows on
--    every page render.
alter table public.watched_movies
  add column if not exists metadata_backfill_attempted_at timestamptz;
