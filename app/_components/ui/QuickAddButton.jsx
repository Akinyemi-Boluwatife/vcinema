"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Check } from "lucide-react";
import { useToast } from "./Toaster";
import { quickAddToWatchlist } from "@/_lib/watchedMovies";

export default function QuickAddButton({ imdbID, title }) {
  const { refresh } = useRouter();
  const { toast } = useToast();
  const [added, setAdded] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        const result = await quickAddToWatchlist(imdbID);
        setAdded(true);
        toast(
          result.added
            ? `Added "${title}" to your watchlist`
            : `"${title}" is already in your lists`,
        );
        refresh();
      } catch {
        toast("Could not add this film. Please try again.", { type: "error" });
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending || added}
      aria-label={added ? "Added to watchlist" : `Add ${title} to watchlist`}
      className="absolute right-2 top-2 z-10 inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur-md transition-opacity hover:bg-background disabled:opacity-60 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
    >
      {added ? <Check className="size-4" /> : <Bookmark className="size-4" />}
    </button>
  );
}
