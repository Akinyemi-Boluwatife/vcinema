import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function HistorySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* KPI row — mirrors HistoryKpis */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} size="sm">
            <CardContent>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-7 w-10" />
                <Skeleton className="h-3 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* By month chart card */}
      <Card>
        <CardContent>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-3 w-12 mb-4" />
          <Skeleton className="h-36 sm:h-[200px] w-full" />
        </CardContent>
      </Card>

      {/* Daily activity heatmap card */}
      <Card>
        <CardContent>
          <Skeleton className="h-5 w-28 mb-1" />
          <Skeleton className="h-3 w-12 mb-4" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>

      {/* Timeline rows */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
