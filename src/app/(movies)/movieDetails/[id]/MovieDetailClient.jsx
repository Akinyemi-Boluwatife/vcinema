"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { addToWatched, getWatchedMovies, removeFromWatched } from "@/lib/watchedMovies";

export default function MovieDetailClient({ movie, movieId }) {
  const [userRating, setUserRating] = useState(0);
  const [existingEntry, setExistingEntry] = useState(null);
  const router = useRouter();

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Plot: plot,
    Runtime: runtime,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbRating,
  } = movie;

  const validPoster = poster && poster !== "N/A" ? poster : null;
  const genres = genre && genre !== "N/A" ? genre.split(", ") : [];

  useEffect(() => {
    const entry = getWatchedMovies().find((m) => m.imdbID === movieId);
    if (entry) {
      setExistingEntry(entry);
      setUserRating(entry.userRating);
    }
  }, [movieId]);

  function handleRemoveFromWatched() {
    removeFromWatched(movieId);
    router.push("/watchedMovies");
  }

  function handleAddToWatched() {
    const parsedRuntime = parseInt(runtime);
    const parsedImdbRating = parseFloat(imdbRating);
    addToWatched({
      title,
      poster,
      imdbID: movieId,
      year,
      imdbRating: isNaN(parsedImdbRating) ? 0 : parsedImdbRating,
      userRating,
      runtime: isNaN(parsedRuntime) ? 0 : parsedRuntime,
    });
    router.push("/watchedMovies");
  }

  return (
    <div className="pb-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-sm mb-5 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
      >
        ← Back
      </button>

      <div className="flex gap-4 mb-6">
        <div className="w-32 flex-shrink-0 sm:w-40">
          {validPoster ? (
            <img
              src={validPoster}
              alt={title}
              className="w-full aspect-[2/3] object-cover rounded-lg"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-surface-high rounded-lg flex items-center justify-center text-on-surface-variant text-xs text-center p-2">
              No Poster
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0 py-1">
          <h1 className="font-bold text-on-surface text-xl leading-tight">{title}</h1>
          <p className="text-on-surface-variant text-sm">{year} · {runtime}</p>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <Badge key={g} variant="default">{g}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-auto">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="font-bold text-on-surface text-sm">{imdbRating}</span>
            <span className="text-on-surface-variant text-xs">IMDB</span>
          </div>
        </div>
      </div>

      {plot && plot !== "N/A" && (
        <div className="mb-6">
          <h2 className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-2">Plot</h2>
          <p className="text-on-surface text-sm leading-relaxed">{plot}</p>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3">
        {director && director !== "N/A" && (
          <div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest">Director</p>
            <p className="text-on-surface text-sm mt-1">{director}</p>
          </div>
        )}
        {actors && actors !== "N/A" && (
          <div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest">Cast</p>
            <p className="text-on-surface text-sm mt-1">{actors}</p>
          </div>
        )}
      </div>

      <div className="bg-surface-low rounded-xl border border-outline-variant/30 p-4 flex flex-col items-center gap-4">
        <h2 className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest">Your Rating</h2>
        <StarRating
          maxRating={10}
          size={28}
          onSetRating={setUserRating}
          color="#d72483"
          defaultRating={existingEntry?.userRating ?? 0}
          key={existingEntry?.imdbID ?? "new"}
        />
        {existingEntry && (
          <p className="text-on-surface-variant text-xs">
            Current rating: {existingEntry.userRating}/10
          </p>
        )}
        {userRating > 0 && (
          <Button
            variant="primary"
            onClick={handleAddToWatched}
            className="w-full rounded-xl py-3 text-sm"
          >
            {existingEntry ? "Update Rating" : "Add to Watchlist"}
          </Button>
        )}
        {existingEntry && (
          <Button
            variant="secondary"
            onClick={handleRemoveFromWatched}
            className="w-full rounded-xl py-3 text-sm !text-error !border-error/40 hover:!bg-error/10"
          >
            Remove from Watchlist
          </Button>
        )}
      </div>
    </div>
  );
}
