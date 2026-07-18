import { Film } from "lucide-react";
import { getPublicWatched, getPublicCollections } from "@/_lib/profiles";

export default async function PublicProfileEmptyState({ username }) {
  const [watched, collections] = await Promise.all([
    getPublicWatched(username),
    getPublicCollections(username),
  ]);

  if (watched.length > 0 || collections.length > 0) return null;

  return (
    <div className="flex flex-col items-center text-center py-12">
      <Film className="size-8 text-muted-foreground mb-4" aria-hidden />
      <p className="text-base font-medium text-foreground mb-1">
        Nothing to show here yet.
      </p>
    </div>
  );
}
