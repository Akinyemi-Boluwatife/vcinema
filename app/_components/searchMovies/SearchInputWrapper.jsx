"use client";
import { useMovieSearch } from "@/_hooks/useMovieSearch";
import SearchInput from "./SearchInput";

function SearchInputWrapper({ size }) {
  const { query, handleQueryChange } = useMovieSearch();

  return (
    <div className="w-full">
      <SearchInput query={query} onQueryChange={handleQueryChange} size={size} />
    </div>
  );
}

export default SearchInputWrapper;
