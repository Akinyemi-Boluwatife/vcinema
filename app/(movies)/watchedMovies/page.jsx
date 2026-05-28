import { Suspense } from "react";
import { MovieContent } from "@/_components/watchedMovies/MovieContent";
import WatchedMoviesContentLoader from "@/_components/watchedMovies/WatchedMoviesContentLoader";
import TabContentWrapper from "@/_components/watchedMovies/TabContentWrapper";
import WatchHistoryView from "@/_components/history/WatchHistoryView";
import TabBar from "./TabBar";

export const metadata = {
  title: "My movies",
  description: "Your watched, want-to-watch, and dropped films in one place.",
};

export default async function WatchedMoviesPage({ searchParams }) {
  const {
    tab,
    year,
    sortBy = "imdb_rating",
    sortOrder = "desc",
    page,
  } = await searchParams;
  const activeTab = ["watched", "want_to_watch", "dropped", "history"].includes(
    tab,
  )
    ? tab
    : "watched";

  const parsedYear = Number(year);
  const yearParam =
    Number.isInteger(parsedYear) && parsedYear >= 1900 && parsedYear <= 2100
      ? parsedYear
      : undefined;

  const parsedPage = Number(page);
  const pageParam =
    Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          My films
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Everything you&apos;ve tracked.
        </p>
      </header>

      <Suspense fallback={<div className="h-14 mb-6" aria-hidden />}>
        <TabBar />
      </Suspense>

      <Suspense fallback={<WatchedMoviesContentLoader />}>
        <TabContentWrapper>
          {activeTab === "history" ? (
            <WatchHistoryView year={yearParam} page={pageParam} />
          ) : (
            <MovieContent
              activeTab={activeTab}
              sortBy={sortBy}
              sortOrder={sortOrder}
              page={pageParam}
            />
          )}
        </TabContentWrapper>
      </Suspense>
    </div>
  );
}
