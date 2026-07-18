import { getPublicWatched } from "@/_lib/profiles";
import MovieCard from "@/_components/ui/MovieCard";
import Pagination from "@/_components/shared/Pagination";
import PublicProfileSection from "./PublicProfileSection";
import { PER_PAGE, paginate } from "./publicProfileUtils";

export default async function PublicWatchedSection({ username, page }) {
  const watched = await getPublicWatched(username);
  if (!watched.length) return null;

  const pageItems = paginate(watched, page, PER_PAGE);

  return (
    <PublicProfileSection
      title="Watched"
      subtitle={`${watched.length} ${watched.length === 1 ? "film" : "films"}`}
    >
      <div className="flex flex-col gap-3">
        {pageItems.map((m) => (
          <MovieCard key={m.imdbID} movie={m} variant="watched" />
        ))}
      </div>
      <Pagination paramName="wp" total={watched.length} perPage={PER_PAGE} />
    </PublicProfileSection>
  );
}
