# 🎬 Vcinema

A movie tracking app with Google sign-in and three personal lists — **Watched**, **Want to Watch**, **Dropped** — backed by Supabase with per-row security.

## ✨ Features

- 🔐 Google OAuth sign-in (NextAuth v5)
- 🔍 Real-time movie search powered by OMDb
- 📋 Three mutually-exclusive lists per user — Watched · Want to Watch · Dropped
- ⭐ Personal 1–10 rating for entries in the Watched list
- 🏷️ Status badges visible at-a-glance on search results
- 📊 Watchlist stats: films, average rating, average runtime
- 🔒 Row-level security in Supabase via custom JWTs signed in the app
- ⚡ Tab transitions powered by `useTransition` for instant loading feedback

## 🧰 Tech stack

- **Next.js 16** (App Router, server actions, Turbopack)
- **React 19**
- **NextAuth v5** for Google OAuth
- **Supabase** (Postgres) with RLS enforced via custom JWTs (`jose`)
- **Tailwind CSS** for styling
- **OMDb API** for movie data

## 🚀 Getting started

### Prerequisites

- Node.js 18.18+ and npm
- A Google Cloud project with an OAuth 2.0 Client ID
- A Supabase project
- An OMDb API key — get one free at https://www.omdbapi.com/apikey.aspx

### 1. Clone and install

```bash
git clone https://github.com/Akinyemi-Boluwatife/vcinema.git
cd vcinema
npm install
```

### 2. Set up the Supabase database

In the Supabase SQL editor, run:

```sql
-- Users table — populated automatically on first sign-in
create table users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  name text,
  image text,
  provider text,
  provider_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Movie lists (watched, want_to_watch, dropped)
create table watched_movies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references users(id) on delete cascade,
  imdb_id text not null,
  title text not null,
  poster text,
  year text,
  imdb_rating numeric,
  user_rating numeric,
  runtime integer,
  status text not null default 'watched'
    check (status in ('watched', 'want_to_watch', 'dropped')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, imdb_id)
);

-- Enable Row Level Security
alter table users enable row level security;
alter table watched_movies enable row level security;

-- Policies — auth.uid() resolves from the JWT the app signs on each request
create policy "users_select_own" on users
  for select using (id = auth.uid());

create policy "users_update_own" on users
  for update using (id = auth.uid());

create policy "watched_movies_own" on watched_movies
  for all using (user_id = auth.uid());
```

### 3. Configure environment variables

Create a `.env.local` file at the project root and add the following keys:

```dotenv
# OMDb — https://www.omdbapi.com/apikey.aspx
OMDB_API_KEY=

# NextAuth (Auth.js v5)
AUTH_SECRET=               # generate with: npx auth secret
AUTH_GOOGLE_ID=            # Google Cloud → APIs & Services → Credentials
AUTH_GOOGLE_SECRET=        # same place as AUTH_GOOGLE_ID
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true

# Supabase — Settings → API in your project dashboard
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   # the publishable / anon key
SUPABASE_SERVICE_ROLE_KEY=              # the service_role secret (server-only)
SUPABASE_JWT_SECRET=                    # Settings → API → JWT Settings → JWT Secret
```

| Variable | Required for | Notes |
|---|---|---|
| `OMDB_API_KEY` | Movie search & details | Server-only, never shipped to the browser. |
| `AUTH_SECRET` | NextAuth | Any 32+ byte random string. `npx auth secret` will print one. |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth | Create OAuth 2.0 Client ID in Google Cloud. |
| `AUTH_URL` | NextAuth | `http://localhost:3000` locally; the deployed URL in production. |
| `AUTH_TRUST_HOST` | NextAuth | Set to `true` outside of Vercel. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Public — safe to expose. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase | Public — RLS blocks it from doing anything anyway. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | **Server-only.** Bypasses RLS. Used only to upsert the user row on first sign-in. |
| `SUPABASE_JWT_SECRET` | Supabase | **Server-only.** Signs the user-scoped JWTs that drive RLS. |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_JWT_SECRET` must **not** have a `NEXT_PUBLIC_` prefix — they would leak to the browser bundle.

When you set up the Google OAuth client, add this redirect URI:
```
http://localhost:3000/api/auth/callback/google
```

### 4. Run the app

```bash
npm run dev
```

Open http://localhost:3000 and sign in with Google. Your user row is upserted into Supabase automatically on first login.

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Start the production server |

## 🏗️ Architecture notes

- **Server actions only** — all Supabase access lives in `app/_lib/watchedMovies.js`. The browser never holds a Supabase client.
- **RLS via custom JWT** — for every list operation, the server signs a short-lived JWT (`jose`) with the user's UUID as `sub` and `role: "authenticated"`. Supabase verifies the signature using `SUPABASE_JWT_SECRET` and resolves `auth.uid()` from the `sub` claim.
- **Service role only on first sign-in** — `auth.js` uses the service role key once, in the `jwt` NextAuth callback, to upsert the user row. After that the user-scoped JWT takes over.
- **Edge-safe auth split** — `auth.config.js` and `auth-edge.js` form the lean Edge-runtime instance consumed by `middleware.js`; `auth.js` is the full Node-runtime instance with the Supabase upsert. This keeps `@supabase/supabase-js` out of the Edge bundle.

## 📁 Project layout

```
app/
├─ (movies)/            # protected routes (movie detail, search, lists)
│  ├─ searchMovies/
│  ├─ watchedMovies/    # tabbed lists page
│  └─ movieDetails/
├─ _components/         # shared UI
├─ _lib/                # server actions (watchedMovies, supabase, actions)
├─ api/auth/[...nextauth]/
├─ signin/              # custom sign-in page
└─ layout.jsx
auth.js                 # full NextAuth instance (Node runtime)
auth.config.js          # Edge-safe NextAuth config
auth-edge.js            # Edge NextAuth instance for middleware
middleware.js           # route protection
```
