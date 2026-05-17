import { listMyCollections } from "@/_lib/collections";
import CollectionCard from "@/_components/collections/CollectionCard";
import NewCollectionDialog from "@/_components/collections/NewCollectionDialog";

export const metadata = {
  title: "My Lists",
};

export default async function ListsPage() {
  const collections = await listMyCollections();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-on-surface-variant text-sm font-medium">Your collections</p>
        {collections.length > 0 && (
          <span className="bg-primary-container text-on-primary-container text-xs font-semibold px-2.5 py-1 rounded-full">
            {collections.length}
          </span>
        )}
      </div>

      <NewCollectionDialog />

      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="text-5xl">🎞️</span>
          <p className="text-on-surface-variant text-sm text-center px-6">
            No collections yet. Make one to start curating — try "Top 10 of All Time" or "Horror Marathons".
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {collections.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      )}
    </div>
  );
}
