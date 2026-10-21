import { cacheLife, cacheTag } from "next/cache";

const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";
const ROW_LIMIT = 12;
const TMDB_TAG = "tmdb";
const UNAVAILABLE = "Recommendations are temporarily unavailable.";

async function tmdbFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`, accept: "application/json" },
  });
  if (!res.ok) throw new Error(`TMDB responded ${res.status} for ${path}`);
  return res.json();
}

async function toSearchItem(movie) {
  const { imdb_id: imdbID } = await tmdbFetch(`/movie/${movie.id}/external_ids`);
  if (!imdbID) return null;
  return {
    imdbID,
    Title: movie.title,
    Year: movie.release_date?.slice(0, 4) || "",
    Poster: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null,
  };
}

// Caches the finished row (list + IMDb IDs) as one entry; any TMDB error throws so failures are never cached.
async function fetchRow(path) {
  "use cache";
  cacheLife("hours");
  cacheTag(TMDB_TAG);

  const data = await tmdbFetch(path);
  const results = (data.results ?? []).slice(0, ROW_LIMIT);
  const items = await Promise.all(results.map(toSearchItem));
  return items.filter(Boolean);
}

async function getMovieList(path, label) {
  if (!process.env.TMDB_READ_TOKEN) return { items: [], error: UNAVAILABLE };
  try {
    return { items: await fetchRow(path), error: null };
  } catch (err) {
    console.error(`[tmdb] ${label}:`, err);
    return { items: [], error: UNAVAILABLE };
  }
}

export function getTrendingMovies() {
  return getMovieList("/trending/movie/week", "getTrendingMovies");
}

export function getPopularMovies() {
  return getMovieList("/movie/popular", "getPopularMovies");
}
