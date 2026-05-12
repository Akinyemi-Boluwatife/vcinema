"use client";

import Input from './ui/Input';

export default function Search({ query, setQuery }) {
  return (
    <Input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search movies..."
    />
  );
}
