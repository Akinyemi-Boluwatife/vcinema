"use server";
import { auth } from "./auth";

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
    .flatMap((s) => { const t = s.trim(); return t ? [t] : []; });
}

export async function getMoviesByStatus(status, sortBy, sortOrder = "desc") {
  const { supabase, user } = await auth();
  if (!user) return [];

  const columnMapping = {
    imdbRating: "imdb_rating",
    imdb_rating: "imdb_rating",
    runtime: "runtime",
    year: "year",
    userRating: "user_rating",
    user_rating: "user_rating",
  };

  const targetColumn = columnMapping[sortBy] || "updated_at";
  const isAscending = sortOrder === "asc";

  const { data } = await supabase
    .from("watched_movies")
    .select(
      "imdb_id, title, poster, year, imdb_rating, user_rating, runtime, status, watched_at, updated_at",
    )
    .eq("user_id", user.id)
    .eq("status", status)
    .order(targetColumn, { ascending: isAscending });

  return (data ?? []).map(toMovie);
}

export async function getMovieStatuses(imdbIDs) {
  const { supabase, user } = await auth();
  if (!user || !imdbIDs.length) return {};
  const { data } = await supabase
    .from("watched_movies")
    .select("imdb_id, status")
    .eq("user_id", user.id)
    .in("imdb_id", imdbIDs);
  return Object.fromEntries((data ?? []).map((r) => [r.imdb_id, r.status]));
}

export async function getMovieEntry(imdbID) {
  const { supabase, user } = await auth();
  if (!user) return null;
  const { data } = await supabase
    .from("watched_movies")
    .select("*")
    .eq("user_id", user.id)
    .eq("imdb_id", imdbID)
    .maybeSingle();
  return data ? toMovie(data) : null;
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

export async function getWatchHistory({ year, limit } = {}) {
  const { supabase, user } = await auth();
  if (!user) return [];

  let query = supabase
    .from("watched_movies")
    .select(
      "imdb_id, title, poster, year, imdb_rating, user_rating, runtime, status, watched_at",
    )
    .eq("user_id", user.id)
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
  const { supabase, user } = await auth();
  if (!user) return [];
  const { data } = await supabase
    .from("watched_movies")
    .select("watched_at")
    .eq("user_id", user.id)
    .eq("status", "watched")
    .not("watched_at", "is", null);
  const years = new Set();
  for (const row of data ?? []) {
    const y = new Date(row.watched_at).getUTCFullYear();
    if (Number.isFinite(y)) years.add(y);
  }
  return Array.from(years).toSorted((a, b) => b - a);
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

async function getFilteredMovies(filters = {}) {
  const { supabase, user } = await auth();
  if (!user) throw new Error("Not authenticated");

  let query = supabase
    .from("watched_movies")
    .select("*")
    .eq("user_id", user.id);

  if (filters.year) {
    const y = Number(filters.year);
    if (Number.isInteger(y) && y >= 1800 && y <= 2999) {
      query = query.ilike("year", `%${y}%`);
    }
  }

  const minR = Number(filters.minRating);
  if (Number.isFinite(minR)) query = query.gte("imdb_rating", minR);

  const maxR = Number(filters.maxRating);
  if (Number.isFinite(maxR)) query = query.lte("imdb_rating", maxR);

  const minRt = Number(filters.minRuntime);
  if (Number.isFinite(minRt)) query = query.gte("runtime", minRt);

  const maxRt = Number(filters.maxRuntime);
  if (Number.isFinite(maxRt)) query = query.lte("runtime", maxRt);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error filtering movies:", error.message);
    throw new Error("Failed to fetch filtered movies");
  }

  return data;
}
