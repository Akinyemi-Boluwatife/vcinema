"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNavigation } from "@/_contexts/NavigationContext";

export function useMovieSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { startNavigation } = useNavigation();
  const debounceRef = useRef(null);

  // Read initial query from URL once on mount — no reactive subscription
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q") || "";
    if (q) setQuery(q);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

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
      }, 500);
    },
    [startNavigation, router]
  );

  return { query, handleQueryChange };
}
