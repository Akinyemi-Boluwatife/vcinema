import SearchedMovies from "@/components/SearchedMovies";
import { searchMovies } from "../actions";


export default async function SearchMoviesPage({ searchParams }) {


  const { q } = await searchParams;
  const query = q || "";

  let movies = [];

  if (query.length >= 3) {
    movies = await searchMovies(query);
  }

  return (

    <SearchedMovies query={query} movies={movies} />

  )
}
