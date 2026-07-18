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
