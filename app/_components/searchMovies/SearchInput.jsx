"use client";

import { useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useKey } from "@/_hooks/useKey";

export default function SearchInput({ query, onQueryChange, size = "md" }) {
  const inputRef = useRef(null);

  const focusInput = useCallback(() => {
    if (document.activeElement !== inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  useKey("Slash", focusInput);

  const isLg = size === "lg";

  return (
    <div className="relative w-full">
      <Search
        aria-hidden
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${
          isLg ? "size-5" : "size-4"
        }`}
      />
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={isLg ? "Search films, directors, genres…" : "Find a film…"}
        className={`pl-9 ${isLg ? "h-12 pr-10 text-base rounded-xl" : "h-10 pr-10"}`}
        aria-label="Search films"
      />
      {query ? (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 size-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
