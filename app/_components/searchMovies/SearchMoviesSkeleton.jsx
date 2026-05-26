import { Skeleton } from "@/components/ui/skeleton";

export default function SearchMoviesSkeleton() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-3 w-32" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[2/3] w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded" />
            <Skeleton className="h-3 w-1/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
