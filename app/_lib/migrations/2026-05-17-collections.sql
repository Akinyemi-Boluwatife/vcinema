-- Adds custom user collections + their items, with RLS for owner CRUD
-- and public-read access for collections the owner has opted to share.
-- Run in the Supabase SQL editor.

create table if not exists collections (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  title        text not null,
  description  text,
  is_public    boolean not null default false,
  public_slug  text unique,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists collections_user_idx on collections(user_id);

create table if not exists collection_items (
  collection_id uuid not null references collections(id) on delete cascade,
  imdb_id       text not null,
  title         text not null,
  poster        text,
  year          text,
  position      integer not null,
  added_at      timestamptz not null default now(),
  primary key (collection_id, imdb_id)
);
create index if not exists collection_items_pos_idx
  on collection_items(collection_id, position);

alter table collections enable row level security;
alter table collection_items enable row level security;

drop policy if exists "owner_all_collections" on collections;
create policy "owner_all_collections" on collections
  for all using (auth.jwt() ->> 'sub' = user_id)
         with check (auth.jwt() ->> 'sub' = user_id);

drop policy if exists "public_read_collections" on collections;
create policy "public_read_collections" on collections
  for select using (is_public = true);

drop policy if exists "owner_all_items" on collection_items;
create policy "owner_all_items" on collection_items
  for all using (
    exists (
      select 1 from collections c
       where c.id = collection_id
         and c.user_id = auth.jwt() ->> 'sub'
    )
  ) with check (
    exists (
      select 1 from collections c
       where c.id = collection_id
         and c.user_id = auth.jwt() ->> 'sub'
    )
  );

drop policy if exists "public_read_items" on collection_items;
create policy "public_read_items" on collection_items
  for select using (
    exists (
      select 1 from collections c
       where c.id = collection_id and c.is_public = true
    )
  );
