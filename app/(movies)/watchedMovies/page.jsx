import { Suspense } from "react";
import { MovieContent } from "../../_components/MovieContent";
import WatchedMoviesContentLoader from "../../_components/WatchedMoviesContentLoader";
import TabContentWrapper from "../../_components/TabContentWrapper";
import TabBar from "./TabBar";

export default async function WatchedMoviesPage({ searchParams }) {
  const { tab } = await searchParams;
  const activeTab = ["watched", "want_to_watch", "dropped"].includes(tab)
    ? tab
    : "watched";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-on-surface font-bold text-2xl mb-4">My Lists</h1>

      <Suspense>
        <TabBar />
      </Suspense>

      <Suspense fallback={<WatchedMoviesContentLoader />}>
        <TabContentWrapper>
          <MovieContent activeTab={activeTab} />
        </TabContentWrapper>
      </Suspense>
    </div>
  );
}
