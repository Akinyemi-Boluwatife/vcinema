import { Suspense } from "react";
import { MovieContent } from "../../_components/MovieContent";
import WatchedMoviesContentLoader from "../../_components/WatchedMoviesContentLoader";
import TabContentWrapper from "../../_components/TabContentWrapper";
import WatchHistoryView from "../../_components/history/WatchHistoryView";
import TabBar from "./TabBar";

export default async function WatchedMoviesPage({ searchParams }) {
  const { tab, year, sortBy = "imdb_rating", sortOrder = "desc" } = await searchParams;
  const activeTab = ["watched", "want_to_watch", "dropped", "history"].includes(
    tab
  )
    ? tab
    : "watched";






  const parsedYear = Number(year);
  const yearParam =
    Number.isInteger(parsedYear) && parsedYear >= 1900 && parsedYear <= 2100
      ? parsedYear
      : undefined;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-on-surface font-bold text-2xl mb-4">My Lists</h1>

      <Suspense>
        <TabBar />
      </Suspense>

      <Suspense fallback={<WatchedMoviesContentLoader />}>
        <TabContentWrapper>
          {activeTab === "history" ? (
            <WatchHistoryView year={yearParam} />
          ) : (
            <MovieContent activeTab={activeTab} sortBy={sortBy} sortOrder={sortOrder} />
          )}
        </TabContentWrapper>
      </Suspense>
    </div>
  );
}
