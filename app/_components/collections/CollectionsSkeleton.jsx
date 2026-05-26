import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function CollectionCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full p-0">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-12 shrink-0" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-16 mt-2" />
      </div>
    </Card>
  );
}

export default function CollectionsSkeleton({ count = 6 }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <CollectionCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
