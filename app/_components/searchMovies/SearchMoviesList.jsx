"use client";

import { Search } from "lucide-react";
import NumResult from "./NumResult";
import MovieList from "./MovieList";
import { useNavigation } from "@/_contexts/NavigationContext";
import SearchInputWrapper from "./SearchInputWrapper";
import SearchEmptyState from "./SearchEmptyState";
import SearchMoviesSkeleton from "./SearchMoviesSkeleton";

export default function SearchMoviesList({ query, movies, statusMap = {}, error = null }) {
  const { isPending } = useNavigation();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

      <div className="md:hidden mb-6">
        <SearchInputWrapper size="lg" />
      </div>

      {isPending ? (
        <SearchMoviesSkeleton />
      ) : (
        <>
          {query.length >= 3 && <NumResult movies={movies} />}

          {query.length === 0 && (
            <SearchEmptyState
              icon={<Search className="size-8" />}
              title="Start searching"
              subtitle="Type at least 3 characters to look up a film."
            />
          )}

          {query.length > 0 && query.length < 3 && (
            <SearchEmptyState
              icon={<Search className="size-8" />}
              title="Keep typing…"
              subtitle="Search needs at least 3 characters."
            />
          )}

          {query.length >= 3 && !movies.length && error && (
            <SearchEmptyState
              icon={<Search className="size-8" />}
              title="Search is temporarily unavailable."
              subtitle="Please try again in a moment."
            />
          )}

          {query.length >= 3 && !movies.length && !error && (
            <SearchEmptyState
              icon={<Search className="size-8" />}
              title={`No films match “${query}”.`}
              subtitle="Try a different title or genre."
            />
          )}

          {movies.length > 0 && (
            <MovieList movies={movies} statusMap={statusMap} />
          )}
        </>
      )}
    </div>

  );
}


