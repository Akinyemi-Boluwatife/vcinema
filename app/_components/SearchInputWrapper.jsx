"use client";
import { useMovieSearch } from "@/_hooks/useMovieSearch";
import SearchInput from "./SearchInput";

function SearchInputWrapper() {
  const { query, handleQueryChange } = useMovieSearch();

  return (
    <div className="flex-1">
      <SearchInput query={query} onQueryChange={handleQueryChange} />
    </div>
  );
}

export default SearchInputWrapper;
