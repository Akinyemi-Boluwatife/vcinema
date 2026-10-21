import { Suspense } from "react";
import SearchedMovies from "@/_components/searchMovies/SearchedMovies";
import SearchMoviesSkeleton from "@/_components/searchMovies/SearchMoviesSkeleton";
import DiscoverRows from "@/_components/searchMovies/DiscoverRows";
import DiscoverRowsSkeleton from "@/_components/searchMovies/DiscoverRowsSkeleton";

export const metadata = {
  title: "Search movies",
  description: "Search for films by title and add them to your collection.",
};

export default async function SearchMoviesPage({ searchParams }) {
  const { q } = await searchParams;
  const query = q || "";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-[28px] md:text-[34px] leading-tight font-bold text-foreground">
          Search
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Find a film by title.
        </p>
      </header>

      <Suspense fallback={<SearchMoviesSkeleton />}>
        <SearchedMovies
          key={query}
          query={query}
          emptySlot={
            query ? null : (
              <Suspense fallback={<DiscoverRowsSkeleton />}>
                <DiscoverRows />
              </Suspense>
            )
          }
        />
      </Suspense>
    </div>
  );
}