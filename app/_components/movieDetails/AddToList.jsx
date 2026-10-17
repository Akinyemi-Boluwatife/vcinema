"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Bookmark, X, Trash2 } from "lucide-react";
import StarRating from "./StarRating";
import { Card, CardContent } from "@/components/ui/card";
import EditWatchedDate from "@/_components/history/EditWatchedDate";
import { useToast } from "@/_components/ui/Toaster";
import { setMovieStatus, removeFromList } from "@/_lib/watchedMovies";

const STATUS_OPTIONS = [
  { key: "want_to_watch", label: "Want to watch", icon: Bookmark },
  { key: "watched", label: "Watched", icon: Eye },
  { key: "dropped", label: "Dropped", icon: X },
];

const STATUS_LABEL = {
  watched: "Watched",
  want_to_watch: "Want to watch",
  dropped: "Dropped",
};

export default function AddToList({ movie, movieId, existingEntry, children }) {
  const { refresh } = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [status, setStatus] = useState(existingEntry?.status ?? null);
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

  function save(nextStatus, nextRating, message) {
    const prev = { status, userRating };
    setStatus(nextStatus);
    setUserRating(nextRating);
    startTransition(async () => {
      try {
        const parsedRuntime = Number.parseInt(runtime, 10);
        const parsedImdbRating = Number.parseFloat(imdbRating);
        await setMovieStatus(
          {
            title,
            poster,
            imdbID: movieId,
            year,
            imdbRating: Number.isFinite(parsedImdbRating) ? parsedImdbRating : null,
            userRating: nextStatus === "watched" ? nextRating : 0,
            runtime: Number.isFinite(parsedRuntime) ? parsedRuntime : null,
            genres: genre,
            director,
            actors,
          },
          nextStatus,
        );
        toast(message);
        refresh();
      } catch (e) {
        setStatus(prev.status);
        setUserRating(prev.userRating);
        toast(e.message || "Could not save. Please try again.", { type: "error" });
      }
    });
  }

  function handleStatus(next) {
    if (next === status) return;
    save(
      next,
      next === "watched" ? userRating : 0,
      status ? `Moved to ${STATUS_LABEL[next]}` : `Added to ${STATUS_LABEL[next]}`,
    );
  }

  function handleRating(value) {
    save("watched", value, value ? `Rated ${value}/10` : "Rating cleared");
  }

  function handleRemove() {
    startTransition(async () => {
      try {
        await removeFromList(movieId);
        setStatus(null);
        setUserRating(0);
        toast("Removed from your lists");
        refresh();
      } catch (e) {
        toast(e.message || "Could not remove this film.", { type: "error" });
      }
    });
  }

  return (
    <Card className="mt-8 max-w-2xl">
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="text-micro">
            {status ? "In your lists" : "Add to your lists"}
          </div>
          <div
            role="radiogroup"
            aria-label="List status"
            className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1"
          >
            {STATUS_OPTIONS.map(({ key, label, icon: Icon }) => {
              const active = status === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={isPending}
                  onClick={() => handleStatus(key)}
                  className={`flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-xs font-medium transition-colors sm:flex-row sm:gap-1.5 sm:text-sm disabled:opacity-60 ${
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {status === "watched" && (
          <div className="flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">
                Your rating · tap again to clear
              </span>
              <StarRating
                maxRating={10}
                size={22}
                defaultRating={userRating}
                onSetRating={handleRating}
              />
            </div>
            {existingEntry?.status === "watched" && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">Watched on</span>
                <EditWatchedDate
                  imdbID={movieId}
                  watchedAt={existingEntry.watchedAt}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          {children}
          {status && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive disabled:opacity-60"
            >
              <Trash2 className="size-3.5" aria-hidden />
              Remove from lists
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
