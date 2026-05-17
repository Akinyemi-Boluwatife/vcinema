-- Migration: drop NextAuth-era tables and rebuild on top of Supabase Auth.
-- All previous user/data is wiped. Run manually in the Supabase SQL editor.

drop table if exists collection_items cascade;
drop table if exists collections      cascade;
drop table if exists watched_movies   cascade;
drop table if exists users            cascade;

-- profiles holds display data, auto-populated from auth.users on signup.
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  image      text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "users_read_own_profile" on profiles
  for select using (auth.uid() = id);

create policy "users_update_own_profile" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Trigger: create profile row on every new auth.users insert.
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name, image)
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- watched_movies — primary table for the user's library.
create table watched_movies (
  user_id     uuid not null references auth.users(id) on delete cascade,
  imdb_id     text not null,
  status      text not null,
  title       text,
  poster      text,
  year        text,
  imdb_rating numeric,
  user_rating int default 0,
  runtime     int,
  genres      text[],
  director    text,
  actors      text[],
  watched_at  timestamptz,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  primary key (user_id, imdb_id)
);

alter table watched_movies enable row level security;

create policy "owner_all_watched" on watched_movies
  for all using (auth.uid() = user_id)
         with check (auth.uid() = user_id);

-- collections — user-owned lists, optionally publicly shareable.
create table collections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  is_public   boolean default false,
  public_slug text unique,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table collections enable row level security;

create policy "owner_all_collections" on collections
  for all using (auth.uid() = user_id)
         with check (auth.uid() = user_id);

create policy "public_read_collections" on collections
  for select using (is_public = true);

-- collection_items — entries within a collection.
create table collection_items (
  collection_id uuid not null references collections(id) on delete cascade,
  imdb_id       text not null,
  title         text,
  poster        text,
  year          text,
  position      int default 0,
  added_at      timestamptz default now(),
  primary key (collection_id, imdb_id)
);

alter table collection_items enable row level security;

create policy "owner_all_items" on collection_items
  for all
  using (
    exists (
      select 1 from collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
  );

create policy "public_read_items" on collection_items
  for select using (
    exists (
      select 1 from collections c
      where c.id = collection_id and c.is_public = true
    )
  );
