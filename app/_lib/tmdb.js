const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w342";
const LIST_TTL = 60 * 60;
const EXTERNAL_IDS_TTL = 60 * 60 * 24 * 30;
const ROW_LIMIT = 12;
const UNAVAILABLE = "Recommendations are temporarily unavailable.";

async function tmdbFetch(path, revalidate) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`, accept: "application/json" },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`TMDB responded ${res.status}`);
  return res.json();
}

async function resolveImdbId(tmdbId) {
  try {
    const data = await tmdbFetch(`/movie/${tmdbId}/external_ids`, EXTERNAL_IDS_TTL);
    return data.imdb_id || null;
  } catch {
    return null;
  }
}

async function toSearchItem(movie) {
  const imdbID = await resolveImdbId(movie.id);
  if (!imdbID) return null;
  return {
    imdbID,
    Title: movie.title,
    Year: movie.release_date?.slice(0, 4) || "",
    Poster: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : null,
  };
}

async function getMovieList(path, label) {
  if (!process.env.TMDB_READ_TOKEN) return { items: [], error: UNAVAILABLE };
  try {
    const data = await tmdbFetch(path, LIST_TTL);
    const results = (data.results ?? []).slice(0, ROW_LIMIT);
    const items = await Promise.all(results.map(toSearchItem));
    return { items: items.filter(Boolean), error: null };
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
