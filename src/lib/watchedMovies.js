export function getWatchedMovies() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("watchedMovies") || "[]");
  } catch {
    return [];
  }
}

export function addToWatched(movie) {
  const watched = getWatchedMovies();
  const index = watched.findIndex((m) => m.imdbID === movie.imdbID);
  if (index === -1) {
    watched.push(movie);
  } else {
    watched[index] = movie;
  }
  localStorage.setItem("watchedMovies", JSON.stringify(watched));
  return watched;
}

export function removeFromWatched(imdbID) {
  const watched = getWatchedMovies().filter((m) => m.imdbID !== imdbID);
  localStorage.setItem("watchedMovies", JSON.stringify(watched));
  return watched;
}
