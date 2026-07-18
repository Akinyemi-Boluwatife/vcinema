import { Suspense } from "react";
import { Film, Bookmark, X, Search } from "lucide-react";
import Link from "next/link";
import WatchedSummary from "./WatchedSummary";
import WatchedMovieList from "./WatchedMovieList";
import Pagination from "@/_components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMoviesByStatus } from "@/_lib/watchedMovies-data";

const EMPTY_STATES = {
  watched: {
    Icon: Film,
    title: "Nothing watched yet.",
    subtitle: "Find a film to mark your first one.",
  },
  want_to_watch: {
    Icon: Bookmark,
    title: "Your watchlist is empty.",
    subtitle: "Add something to come back to.",
  },
  dropped: {
    Icon: X,
    title: "No dropped films.",
    subtitle: "Films you've abandoned will show up here.",
  },
};

const TAB_LABELS = {
  watched: "Watched",
  want_to_watch: "Want to watch",
  dropped: "Dropped",
};

const PER_PAGE = 10;

export async function MovieContent({ activeTab, sortBy, sortOrder, page = 1 }) {
  const movies = await getMoviesByStatus(activeTab, sortBy, sortOrder);
  const { Icon, title, subtitle } = EMPTY_STATES[activeTab];

  const totalPages = Math.max(1, Math.ceil(movies.length / PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const pageMovies = movies.slice(start, start + PER_PAGE);

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-medium text-foreground">
          {TAB_LABELS[activeTab]}
        </h2>
        {movies.length > 0 && (
          <Badge variant="outline" className="text-xs">
            {movies.length}
          </Badge>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center text-center py-12 sm:py-20 px-4">
          <Icon className="size-8 text-muted-foreground mb-4" aria-hidden />
          <p className="text-base font-medium text-foreground mb-1">{title}</p>
          <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>
          <Button asChild>
            <Link href="/searchMovies">
              <Search className="size-4" />
              Find a film
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {activeTab === "watched" && <WatchedSummary watched={movies} />}
          <WatchedMovieList watched={pageMovies} />
          <Suspense>
            <Pagination total={movies.length} perPage={PER_PAGE} />
          </Suspense>
        </>
      )}
    </>
  );
}
