import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function KpiSkeleton() {
  return (
    <Card size="sm">
      <CardContent>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCardSkeleton() {
  return (
    <Card className="mb-4">
      <CardContent>
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="w-full h-64" />
      </CardContent>
    </Card>
  );
}

function TopPeopleSkeleton() {
  return (
    <Card className="flex-1">
      <CardContent>
        <Skeleton className="h-4 w-28 mb-4" />
        <div className="flex flex-col">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-2 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-8" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatsSkeleton() {
  return (
    <>
      <Card className="mb-4">
        <CardContent className="space-y-3 py-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-56" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="md:col-span-2">
          <ChartCardSkeleton />
        </div>
        <div>
          <ChartCardSkeleton />
        </div>
      </div>

      <ChartCardSkeleton />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TopPeopleSkeleton />
        <TopPeopleSkeleton />
      </div>
    </>
  );
}
