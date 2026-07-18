import { Skeleton } from "@/components/ui/skeleton";

export default function PublicListsSectionSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <Skeleton className="h-6 w-28" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full" />
        ))}
      </div>
    </section>
  );
}
