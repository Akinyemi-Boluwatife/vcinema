import WatchedSummary from "@/_components/WatchedSummary";
import WatchedMovieList from "@/_components/WatchedMovieList";
import { getMoviesByStatus } from "@/_lib/watchedMovies";

const EMPTY_STATES = {
  watched: {
    icon: "🎬",
    text: "No movies watched yet. Search and rate a movie to add it!",
  },
  want_to_watch: {
    icon: "🍿",
    text: "Your queue is empty. Find movies you want to watch!",
  },
  dropped: { icon: "💨", text: "Nothing dropped yet." },
};

const TAB_LABELS = {
  watched: "Watched",
  want_to_watch: "Want to Watch",
  dropped: "Dropped",
};

// 👇 separate async component that does the fetching
export async function MovieContent({ activeTab, sortBy, sortOrder }) {
  const movies = await getMoviesByStatus(activeTab, sortBy, sortOrder);
  const { icon, text } = EMPTY_STATES[activeTab];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-on-surface-variant text-sm font-medium">
          {TAB_LABELS[activeTab]}
        </p>
        {movies.length > 0 && (
          <span className="bg-primary-container text-on-primary-container text-xs font-semibold px-2.5 py-1 rounded-full">
            {movies.length}
          </span>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-5xl">{icon}</span>
          <p className="text-on-surface-variant text-sm text-center">{text}</p>
        </div>
      ) : (
        <>
          {activeTab === "watched" && <WatchedSummary watched={movies} />}
          <WatchedMovieList watched={movies} />
        </>
      )}
    </>
  );
}
