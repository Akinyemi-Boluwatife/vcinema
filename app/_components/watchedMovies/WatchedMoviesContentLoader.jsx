import { Skeleton } from "@/components/ui/skeleton";

function WatchedMoviesContentLoader() {
  return (
    <div className="space-y-3 mt-2">
      <Skeleton className="h-4 w-24" />
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-20 rounded-lg" />
      ))}
    </div>
  );
}

export default WatchedMoviesContentLoader;
