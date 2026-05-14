import SearchedMovies from "@/_components/SearchedMovies";
import { searchMovies } from "@/_lib/actions";
import { getMovieStatuses } from "@/_lib/watchedMovies";

export default async function SearchMoviesPage({ searchParams }) {
  const { q } = await searchParams;
  const query = q || "";

  let movies = [];
  let statusMap = {};

  if (query.length >= 3) {
    movies = await searchMovies(query);
    if (movies.length) {
      statusMap = await getMovieStatuses(movies.map((m) => m.imdbID));
    }
  }

  return <SearchedMovies query={query} movies={movies} statusMap={statusMap} />;
}
