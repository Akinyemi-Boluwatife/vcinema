"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateWatchedDate } from "@/_lib/watchedMovies";

export function useUpdateWatchedDate(imdbID) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const save = useCallback(
    (isoDate) =>
      new Promise((resolve) => {
        if (!isoDate) {
          setError("Pick a date");
          resolve(false);
          return;
        }
        setError("");
        startTransition(async () => {
          try {
            await updateWatchedDate(imdbID, isoDate);
            router.refresh();
            resolve(true);
          } catch (e) {
            setError(e.message || "Could not update date");
            resolve(false);
          }
        });
      }),
    [imdbID, router]
  );

  const clearError = useCallback(() => setError(""), []);

  return { save, isPending, error, clearError };
}
