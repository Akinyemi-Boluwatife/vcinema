"use server";
import { auth } from "../../auth";
import { createUserSupabaseClient } from "./supabase";

function toMovie(row) {
  return {
    imdbID: row.imdb_id,
    title: row.title,
    poster: row.poster,
    year: row.year,
    imdbRating: row.imdb_rating,
    userRating: row.user_rating,
    runtime: row.runtime,
    status: row.status,
    genres: row.genres ?? [],
    director: row.director ?? null,
    actors: row.actors ?? [],
    watchedAt: row.watched_at ?? null,
  };
}

function splitOmdbList(value) {
  if (!value || typeof value !== "string") return [];
  if (value === "N/A") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function getMoviesByStatus(status) {
  const session = await auth();
  if (!session?.user?.id) return [];
  const supabase = await createUserSupabaseClient(session.user.id);
  const { data } = await supabase
    .from("watched_movies")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("status", status)
    .order("updated_at", { ascending: false });
  return (data ?? []).map(toMovie);
}

export async function getMovieStatuses(imdbIDs) {
  const session = await auth();
  if (!session?.user?.id || !imdbIDs.length) return {};
  const supabase = await createUserSupabaseClient(session.user.id);
  const { data } = await supabase
    .from("watched_movies")
    .select("imdb_id, status")
    .eq("user_id", session.user.id)
    .in("imdb_id", imdbIDs);
  return Object.fromEntries((data ?? []).map((r) => [r.imdb_id, r.status]));
}

export async function getMovieEntry(imdbID) {
  const session = await auth();
  if (!session?.user?.id) return null;
  const supabase = await createUserSupabaseClient(session.user.id);
  const { data } = await supabase
    .from("watched_movies")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("imdb_id", imdbID)
    .maybeSingle();
  return data ? toMovie(data) : null;
}

export async function setMovieStatus(movie, status) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const supabase = await createUserSupabaseClient(session.user.id);

  const { data: existing } = await supabase
    .from("watched_movies")
    .select("status, watched_at")
    .eq("user_id", session.user.id)
    .eq("imdb_id", movie.imdbID)
    .maybeSingle();

  const now = new Date().toISOString();
  const becomingWatched =
    status === "watched" && existing?.status !== "watched";
  const watchedAt =
    status === "watched"
      ? becomingWatched
        ? now
        : (existing?.watched_at ?? now)
      : null;

  const genres = Array.isArray(movie.genres)
    ? movie.genres
    : splitOmdbList(movie.genres);
  const actors = Array.isArray(movie.actors)
    ? movie.actors
    : splitOmdbList(movie.actors);
  const director =
    movie.director && movie.director !== "N/A" ? movie.director : null;

  await supabase.from("watched_movies").upsert(
    {
      user_id: session.user.id,
      imdb_id: movie.imdbID,
      title: movie.title,
      poster: movie.poster,
      year: movie.year,
      imdb_rating: movie.imdbRating,
      user_rating: movie.userRating ?? 0,
      runtime: movie.runtime,
      status,
      genres,
      director,
      actors,
      watched_at: watchedAt,
      updated_at: now,
    },
    { onConflict: "user_id,imdb_id" }
  );
}

export async function removeFromList(imdbID) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  const supabase = await createUserSupabaseClient(session.user.id);
  await supabase
    .from("watched_movies")
    .delete()
    .eq("user_id", session.user.id)
    .eq("imdb_id", imdbID);
}

export async function getWatchHistory({ year, limit } = {}) {
  const session = await auth();
  if (!session?.user?.id) return [];
  const supabase = await createUserSupabaseClient(session.user.id);

  let query = supabase
    .from("watched_movies")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("status", "watched")
    .not("watched_at", "is", null)
    .order("watched_at", { ascending: false });

  if (year) {
    const start = `${year}-01-01T00:00:00.000Z`;
    const end = `${Number(year) + 1}-01-01T00:00:00.000Z`;
    query = query.gte("watched_at", start).lt("watched_at", end);
  }
  if (limit) query = query.limit(limit);

  const { data } = await query;
  return (data ?? []).map(toMovie);
}

export async function getWatchedYears() {
  const session = await auth();
  if (!session?.user?.id) return [];
  const supabase = await createUserSupabaseClient(session.user.id);
  const { data } = await supabase
    .from("watched_movies")
    .select("watched_at")
    .eq("user_id", session.user.id)
    .eq("status", "watched")
    .not("watched_at", "is", null);
  const years = new Set();
  for (const row of data ?? []) {
    const y = new Date(row.watched_at).getUTCFullYear();
    if (Number.isFinite(y)) years.add(y);
  }
  return [...years].sort((a, b) => b - a);
}

export async function updateWatchedDate(imdbID, isoDateString) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const parsed = new Date(isoDateString);
  if (Number.isNaN(parsed.getTime())) throw new Error("Invalid date");
  if (parsed.getTime() > Date.now() + 24 * 60 * 60 * 1000)
    throw new Error("Date cannot be in the future");

  const supabase = await createUserSupabaseClient(session.user.id);
  const iso = parsed.toISOString();

  const { data, error } = await supabase
    .from("watched_movies")
    .update({ watched_at: iso })
    .eq("user_id", session.user.id)
    .eq("imdb_id", imdbID)
    .eq("status", "watched")
    .select("watched_at")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Movie is not marked watched");
  return data.watched_at;
}
