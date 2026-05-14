"use client";

import { useRef, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import Input from "./ui/Input";
import { useKey } from "@/_hooks/useKey";

export default function SearchInput({ query, onQueryChange }) {
  const inputRef = useRef(null);

  const focusInput = useCallback(() => {
    if (document.activeElement !== inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  useKey("Slash", focusInput);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search movies... [ / ]"
        className={query ? "pr-8" : ""}
      />
      {query && (
        <button
          onClick={() => onQueryChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors"
          aria-label="Clear search"
          type="button"
        >
          <IoClose size={16} />
        </button>
      )}
    </div>
  );
}
