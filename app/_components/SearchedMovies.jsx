"use client";

import NumResult from "./NumResult";
import MovieList from "./MovieList";
import Loader from "./Loader";
import { useNavigation } from "@/_contexts/NavigationContext";

export default function SearchedMovies({ query, movies, statusMap = {} }) {
  const { isPending } = useNavigation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {query.length >= 3 && <NumResult movies={movies} />}

      {isPending && <Loader />}

      {!isPending && query.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-4xl">Movie Not Found</span>
          <p className="text-on-surface-variant text-sm text-center">
            Search for a movie to get started
          </p>
        </div>
      )}

      {!isPending && query.length > 0 && query.length < 3 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-4xl">✍️</span>
          <p className="text-on-surface-variant text-sm text-center">
            Type at least 3 characters
          </p>
        </div>
      )}

      {!isPending && query.length >= 3 && !movies.length && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-4xl">🎬</span>
          <p className="text-on-surface-variant text-sm text-center">
            No movies found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}

      {!isPending && movies.length > 0 && <MovieList movies={movies} statusMap={statusMap} />}
    </div>
  );
}
