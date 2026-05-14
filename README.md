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
