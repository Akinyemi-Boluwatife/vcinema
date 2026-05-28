"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Bookmark, X, Trash2, Star } from "lucide-react";
import StarRating from "./StarRating";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EditWatchedDate from "@/_components/history/EditWatchedDate";
import { setMovieStatus, removeFromList } from "@/_lib/watchedMovies";

const STATUS_OPTIONS = [
  { key: "want_to_watch", label: "Want to watch", icon: Bookmark },
  { key: "watched", label: "Watched", icon: Eye },
  { key: "dropped", label: "Dropped", icon: X },
];

const STATUS_LABEL = {
  watched: "Watched",
  want_to_watch: "Want to Watch",
  dropped: "Dropped",
};

export default function AddToList({ movie, movieId, existingEntry }) {
  const { push } = useRouter();
  const [isEditing, setIsEditing] = useState(!existingEntry);
  const [isPendingSave, startSaving] = useTransition();
  const [isPendingRemove, startRemoving] = useTransition();

  const [status, setStatus] = useState(existingEntry?.status ?? "want_to_watch");
  const [userRating, setUserRating] = useState(existingEntry?.userRating ?? 0);
  const [error, setError] = useState(null);

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
    setError(null);
    startSaving(async () => {
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
            userRating: status === "watched" ? userRating : 0,
            runtime: Number.isFinite(parsedRuntime) ? parsedRuntime : null,
            genres: genre,
            director,
            actors,
          },
          status,
        );
        push(`/watchedMovies?tab=${status}`);
      } catch (e) {
        setError(e.message || "Could not save changes. Please try again.");
      }
    });
  }

  function handleRemove() {
    setError(null);
    startRemoving(async () => {
      try {
        await removeFromList(movieId);
        push("/watchedMovies");
      } catch (e) {
        setError(e.message || "Could not remove this film. Please try again.");
      }
    });
  }

  if (existingEntry && !isEditing) {
    return (
      <Card className="mt-8 max-w-2xl">
        <CardContent className="space-y-4">
          <div className="text-micro">Track this film</div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <Check className="size-4 text-primary" />
              <span className="text-foreground">
                In your {STATUS_LABEL[existingEntry.status]} list
                {existingEntry.status === "watched" &&
                  existingEntry.userRating > 0 &&
                  <> · <Star className="inline size-3 fill-current mb-0.5" /> {existingEntry.userRating}/10</>}
              </span>
            </div>
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 max-w-2xl">
      <CardContent className="space-y-4">
        <div className="text-micro">
          {existingEntry ? "Edit list entry" : "Track this film"}
        </div>

        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map(({ key, label, icon: Icon }) => {
            const active = status === key;
            return (
              <Button
                key={key}
                type="button"
                variant={active ? "default" : "outline"}
                size="sm"
                className="h-9"
                disabled={isPending}
                onClick={() => setStatus(key)}
              >
                <Icon className="size-3.5" />
                {label}
              </Button>
            );
          })}
        </div>

        {status === "watched" && (
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-muted-foreground">Your rating</span>
              <StarRating
                maxRating={10}
                size={22}
                onSetRating={setUserRating}
                defaultRating={
                  existingEntry?.status === "watched"
                    ? (existingEntry.userRating ?? 0)
                    : 0
                }
                key={status}
              />
            </div>
            {existingEntry?.status === "watched" && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-muted-foreground">
                  Watched on
                </span>
                <EditWatchedDate
                  imdbID={movieId}
                  watchedAt={existingEntry.watchedAt}
                />
              </div>
            )}
          </div>
        )}

        {error && <p className="text-destructive text-xs">{error}</p>}

        <div className="flex gap-2 flex-wrap pt-2">
          <Button onClick={handleSave} disabled={isPending} className="h-10">
            {isPendingSave
              ? "Saving…"
              : existingEntry
                ? "Update"
                : "Save to list"}
          </Button>

          {existingEntry && (
            <>
              <Button
                variant="destructive"
                onClick={handleRemove}
                disabled={isPending}
                className="h-10"
              >
                <Trash2 className="size-3.5" />
                {isPendingRemove ? "Removing…" : "Remove"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
                className="h-10"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
