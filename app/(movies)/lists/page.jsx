import NewCollectionDialog from "@/_components/collections/NewCollectionDialog";
import CollectionsSkeleton from "@/_components/collections/CollectionsSkeleton";
import { Suspense } from "react";
import { CollectionsWrapper } from "@/_components/collections/CollectionsWrapper";

export const metadata = {
  title: "My Lists",
};

export default function ListsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Lists
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Curate your own collections.
          </p>
        </div>
        <NewCollectionDialog />
      </header>

      <Suspense fallback={<CollectionsSkeleton />}>
        <CollectionsWrapper />
      </Suspense >
    </div>
  );
}
