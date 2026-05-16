"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/_components/StarRating";
import Button from "@/_components/ui/Button";
import { setMovieStatus, removeFromList } from "@/_lib/watchedMovies";

const STATUS_OPTIONS = [
  { key: "want_to_watch", label: "Want to Watch" },
  { key: "watched", label: "Watched" },
  { key: "dropped", label: "Dropped" },
];

const STATUS_LABEL = {
  watched: "Watched",
  want_to_watch: "Want to Watch",
  dropped: "Dropped",
};

const STATUS_BANNER = {
  watched: "bg-green-500/15 text-green-400 border-green-500/30",
  want_to_watch: "bg-primary/15 text-primary border-primary/30",
  dropped: "bg-surface-high text-on-surface-variant border-outline-variant/40",
};

export default function AddToList({ movie, movieId, existingEntry }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(!existingEntry);
  const [isPendingSave, startSaving] = useTransition();
  const [isPendingRemove, startRemoving] = useTransition();

  const [status, setStatus] = useState(existingEntry?.status ?? "want_to_watch");
  const [userRating, setUserRating] = useState(existingEntry?.userRating ?? 0);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Genre: genre,
    Director: director,
    Actors: actors,
  } = movie;

  const isPending = isPendingSave || isPendingRemove;

  function handleSave() {
    startSaving(async () => {
      const parsedRuntime = parseInt(runtime);
      const parsedImdbRating = parseFloat(imdbRating);
      await setMovieStatus(
        {
          title,
          poster,
          imdbID: movieId,
          year,
          imdbRating: isNaN(parsedImdbRating) ? 0 : parsedImdbRating,
          userRating: status === "watched" ? userRating : 0,
          runtime: isNaN(parsedRuntime) ? 0 : parsedRuntime,
          genres: genre,
          director,
          actors,
        },
        status
      );
      router.push(`/watchedMovies?tab=${status}`);
    });
  }

  function handleRemove() {
    startRemoving(async () => {
      await removeFromList(movieId);
      router.push("/watchedMovies");
    });
  }

  // Compact view — shown when the movie is already in a list and the user
  // hasn't clicked Edit yet.
  if (existingEntry && !isEditing) {
    return (
      <div className="bg-surface-low rounded-xl border border-outline-variant/30 p-4 flex flex-col gap-4">
        <div
          className={`flex items-center justify-center gap-2 text-xs font-semibold py-2 px-3 rounded-lg border ${STATUS_BANNER[existingEntry.status]}`}
        >
          <span>✓</span>
          <span>
            Currently in your {STATUS_LABEL[existingEntry.status]} list
            {existingEntry.status === "watched" && existingEntry.userRating > 0 &&
              ` · ★ ${existingEntry.userRating}/10`}
          </span>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsEditing(true)}
          className="w-full rounded-xl py-3 text-sm"
        >
          Edit
        </Button>
      </div>
    );
  }

  // Edit view — shown for new entries, or after clicking Edit on an existing one.
  return (
    <div className="bg-surface-low rounded-xl border border-outline-variant/30 p-4 flex flex-col gap-4">
      {existingEntry && (
        <div
          className={`flex items-center justify-center gap-2 text-xs font-semibold py-2 px-3 rounded-lg border ${STATUS_BANNER[existingEntry.status]}`}
        >
          <span>✓</span>
          <span>
            Currently in your {STATUS_LABEL[existingEntry.status]} list
          </span>
        </div>
      )}

      <h2 className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest text-center">
        {existingEntry ? "Edit list entry" : "Add to a list"}
      </h2>

      <div className="flex gap-1 p-1 bg-surface-high rounded-xl border border-outline-variant/20">
        {STATUS_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatus(key)}
            disabled={isPending}
            className={`flex-1 text-xs font-semibold py-2 px-1 rounded-lg transition-all duration-200 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed ${
              status === key
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {status === "watched" && (
        <div className="flex flex-col items-center gap-3">
          <StarRating
            maxRating={10}
            size={28}
            onSetRating={setUserRating}
            color="#d72483"
            defaultRating={
              existingEntry?.status === "watched"
                ? existingEntry.userRating ?? 0
                : 0
            }
            key={status}
          />
          {existingEntry?.status === "watched" &&
            existingEntry.userRating > 0 && (
              <p className="text-on-surface-variant text-xs">
                Current rating: {existingEntry.userRating}/10
              </p>
            )}
        </div>
      )}

      <Button
        variant="primary"
        onClick={handleSave}
        disabled={isPending}
        className="w-full rounded-xl py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPendingSave ? "Saving…" : existingEntry ? "Update" : "Save to List"}
      </Button>

      {existingEntry && (
        <>
          <Button
            variant="secondary"
            onClick={handleRemove}
            disabled={isPending}
            className="w-full rounded-xl py-3 text-sm !text-error !border-error/40 hover:!bg-error/10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPendingRemove ? "Removing…" : "Remove from List"}
          </Button>

          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={isPending}
            className="text-on-surface-variant hover:text-on-surface text-xs text-center bg-transparent border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
