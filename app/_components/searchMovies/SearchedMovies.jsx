import { searchMovies } from "@/_lib/omdb";
import { getMovieStatuses } from "@/_lib/watchedMovies";
import SearchMoviesList from "./SearchMoviesList";

export default async function SearchedMovies({ query }) {
  let movies = [];
  let statusMap = {};
  let error = null;

  if (query.length >= 3) {
    const result = await searchMovies(query);
    movies = result.items;
    error = result.error;
    if (movies.length) {
      statusMap = await getMovieStatuses(movies.map((m) => m.imdbID));
    }
  }

  return (
    <SearchMoviesList
      query={query}
      movies={movies}
      statusMap={statusMap}
      error={error}
    />
  );
}