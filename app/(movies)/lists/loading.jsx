import CollectionsSkeleton from "@/_components/collections/CollectionsSkeleton";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="h-8 w-14 rounded-md bg-muted animate-pulse mb-2" />
          <div className="h-4 w-48 rounded-md bg-muted animate-pulse" />
        </div>
      </header>
      <CollectionsSkeleton />
    </div>
  );
}
