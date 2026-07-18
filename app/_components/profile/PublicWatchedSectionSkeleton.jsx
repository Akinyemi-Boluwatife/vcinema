import { Skeleton } from "@/components/ui/skeleton";

export default function PublicWatchedSectionSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <Skeleton className="h-6 w-24" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    </section>
  );
}
