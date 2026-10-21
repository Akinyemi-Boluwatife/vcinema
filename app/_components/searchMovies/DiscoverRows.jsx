import { Search } from "lucide-react";
import { getPopularMovies, getTrendingMovies } from "@/_lib/tmdb";
import { getMovieStatuses } from "@/_lib/watchedMovies-data";
import MovieRow from "./MovieRow";
import SearchEmptyState from "./SearchEmptyState";
import TmdbAttribution from "./TmdbAttribution";

export default async function DiscoverRows() {
  const [trending, popular] = await Promise.all([getTrendingMovies(), getPopularMovies()]);

  if (!trending.items.length && !popular.items.length) {
    return (
      <SearchEmptyState
        icon={<Search className="size-8" />}
        title="Start searching"
        subtitle="Type at least 3 characters to look up a film."
      />
    );
  }

  const imdbIDs = [...new Set([...trending.items, ...popular.items].map((m) => m.imdbID))];
  const statusMap = await getMovieStatuses(imdbIDs);

  return (
    <>
      <MovieRow title="Trending this week" movies={trending.items} statusMap={statusMap} />
      <MovieRow title="Popular" movies={popular.items} statusMap={statusMap} />
      <TmdbAttribution />
    </>
  );
}
