import { Skeleton } from "@/components/ui/skeleton";

const ROWS = 2;
const CARDS_PER_ROW = 12;

export default function DiscoverRowsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading recommendations">
      {Array.from({ length: ROWS }).map((_, row) => (
        <div key={row} className="mb-10">
          <Skeleton className="h-6 w-44 rounded mb-4" />
          <div className="-mx-4 px-4 flex gap-4 overflow-hidden sm:mx-0 sm:px-0 md:grid md:grid-cols-4 md:gap-x-4 md:gap-y-6 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: CARDS_PER_ROW }).map((_, i) => (
              <div key={i} className="w-32 shrink-0 space-y-2 sm:w-36 md:w-auto">
                <Skeleton className="aspect-[2/3] w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
