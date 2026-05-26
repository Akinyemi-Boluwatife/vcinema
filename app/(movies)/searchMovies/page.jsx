import { Suspense } from "react";
import SearchedMovies from "@/_components/searchMovies/SearchedMovies";
import SearchMoviesSkeleton from "@/_components/searchMovies/SearchMoviesSkeleton";

export default async function SearchMoviesPage({ searchParams }) {
  const { q } = await searchParams;
  const query = q || "";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Search
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Find a film by title.
        </p>
      </header>

      <Suspense fallback={<SearchMoviesSkeleton />}>
        <SearchedMovies key={query} query={query} />
      </Suspense>
    </div>
  );
}