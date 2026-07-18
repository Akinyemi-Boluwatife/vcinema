import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-6">
      <Skeleton className="h-8 w-28 self-start" />

      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-20 mt-1" />
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <Skeleton className="h-9 w-40" />
      </div>
    </div>
  );
}
