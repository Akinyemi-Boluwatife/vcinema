-- Adds the columns the /stats dashboard depends on.
-- Run in the Supabase SQL editor, then reload /stats.
alter table watched_movies
  add column if not exists genres      text[],
  add column if not exists director    text,
  add column if not exists actors      text[],
  add column if not exists watched_at  timestamptz;

-- Treat the existing updated_at as the watch date for rows already marked watched.
update watched_movies
   set watched_at = updated_at
 where status = 'watched' and watched_at is null;
