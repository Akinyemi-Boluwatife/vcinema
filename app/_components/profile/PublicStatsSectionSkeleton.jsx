import { Skeleton } from "@/components/ui/skeleton";

export default function PublicStatsSectionSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <Skeleton className="h-6 w-20" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </section>
  );
}
