"use server";
import { auth } from "./auth";

function splitOmdbList(value) {
  if (!value || typeof value !== "string") return [];
  if (value === "N/A") return [];
  return value
    .split(",")
    .flatMap((s) => { const t = s.trim(); return t ? [t] : []; });
}

export async function setMovieStatus(movie, status) {
  const { supabase, user } = await auth();
  if (!user) throw new Error("Not authenticated");

  const { data: existing } = await supabase
    .from("watched_movies")
    .select("status, watched_at")
    .eq("user_id", user.id)
    .eq("imdb_id", movie.imdbID)
    .maybeSingle();

  const now = new Date().toISOString();
  const becomingWatched =
    status === "watched" && existing?.status !== "watched";
  const watchedAt =
    becomingWatched && !existing?.watched_at
      ? now
      : (existing?.watched_at ?? null);

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
      user_id: user.id,
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
  const { supabase, user } = await auth();
  if (!user) throw new Error("Not authenticated");
  await supabase
    .from("watched_movies")
    .delete()
    .eq("user_id", user.id)
    .eq("imdb_id", imdbID);
}

export async function updateWatchedDate(imdbID, isoDateString) {
  const { supabase, user } = await auth();
  if (!user) throw new Error("Not authenticated");

  const parsed = new Date(isoDateString);
  if (Number.isNaN(parsed.getTime())) throw new Error("Invalid date");
  if (parsed.getTime() > Date.now() + 24 * 60 * 60 * 1000)
    throw new Error("Date cannot be in the future");
  if (parsed.getUTCFullYear() < 1900)
    throw new Error("Date is too far in the past");

  const iso = parsed.toISOString();

  const { data, error } = await supabase
    .from("watched_movies")
    .update({ watched_at: iso })
    .eq("user_id", user.id)
    .eq("imdb_id", imdbID)
    .eq("status", "watched")
    .select("watched_at")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Movie is not marked watched");
  return data.watched_at;
}
