"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useMovieSearch } from "@/_hooks/useMovieSearch";
import SearchInput from "./SearchInput";

function SearchInputInner({ size }) {
  const searchParams = useSearchParams();
  const get = searchParams.get.bind(searchParams);
  const { query, handleQueryChange } = useMovieSearch(get("q") ?? "");

  return (
    <div className="w-full">
      <SearchInput query={query} onQueryChange={handleQueryChange} size={size} />
    </div>
  );
}

export default function SearchInputWrapper({ size }) {
  return <Suspense fallback={null}><SearchInputInner size={size} /></Suspense>;
}
