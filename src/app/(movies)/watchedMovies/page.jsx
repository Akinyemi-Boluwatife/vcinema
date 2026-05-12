"use client";

import { useState, useEffect } from "react";
import WatchedSummary from "@/components/WatchedSummary";
import WatchedMovieList from "@/components/WatchedMovieList";
import { getWatchedMovies } from "@/lib/watchedMovies";

export default function WatchedMoviesPage() {
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    setWatched(getWatchedMovies());
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-on-surface font-bold text-2xl">My Watchlist</h1>
        {watched.length > 0 && (
          <span className="bg-primary-container text-on-primary-container text-xs font-semibold px-2.5 py-1 rounded-full">
            {watched.length}
          </span>
        )}
      </div>

      {watched.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-5xl">🎬</span>
          <p className="text-on-surface-variant text-sm text-center">
            No movies watched yet. Search and rate a movie to add it!
          </p>
        </div>
      ) : (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </>
      )}
    </div>
  );
}
