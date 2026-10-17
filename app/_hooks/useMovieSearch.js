"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/_contexts/NavigationContext";

export function useMovieSearch(initialQuery = "") {
  const router = useRouter();
  const { startNavigation } = useNavigation();
  const [query, setQuery] = useState(initialQuery);
  const debounceRef = useRef(null);

  const handleQueryChange = useCallback(
    (nextQuery) => {
      setQuery(nextQuery);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        if (nextQuery.length >= 3) {
          startNavigation(() =>
            router.push(`/searchMovies?q=${encodeURIComponent(nextQuery)}`)
          );
        } else if (
          nextQuery.length === 0 &&
          window.location.pathname === "/searchMovies"
        ) {
          startNavigation(() => router.push("/searchMovies"));
        }
      }, 350);
    },
    [startNavigation, router]
  );

  const handleSubmit = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length >= 3) {
      startNavigation(() =>
        router.push(`/searchMovies?q=${encodeURIComponent(query)}`)
      );
    }
  }, [query, startNavigation, router]);

  return { query, handleQueryChange, handleSubmit };
}
