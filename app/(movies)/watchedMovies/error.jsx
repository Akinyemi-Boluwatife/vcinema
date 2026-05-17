"use client";

import { useEffect } from "react";
import Button from "@/_components/ui/Button";

export default function WatchedMoviesError({ error, reset }) {
  useEffect(() => {
    console.error("watchedMovies route error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-surface-high rounded-lg border border-outline-variant/30 p-8 text-center flex flex-col gap-4">
        <h2 className="text-on-surface text-lg font-semibold">
          We couldn't load your list
        </h2>
        <p className="text-on-surface-variant text-sm">
          {error?.message ?? "Something went wrong on the server."}
        </p>
        <div className="flex justify-center">
          <Button
            variant="primary"
            onClick={reset}
            className="rounded-xl py-2 px-4 text-sm"
          >
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
