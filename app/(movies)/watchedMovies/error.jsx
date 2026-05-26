"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WatchedMoviesError({ error, reset }) {
  useEffect(() => {
    console.error("watchedMovies route error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Card>
        <CardContent className="text-center flex flex-col gap-4 items-center py-2">
          <p className="text-base font-medium text-foreground">
            We couldn&apos;t load your list
          </p>
          <p className="text-sm text-muted-foreground">
            {error?.message ?? "Something went wrong on the server."}
          </p>
          <Button onClick={reset} className="mt-2">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
