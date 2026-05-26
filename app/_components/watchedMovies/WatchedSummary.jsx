import { Card, CardContent } from "@/components/ui/card";

const average = (arr) =>
  arr.length ? arr.reduce((acc, cur) => acc + cur / arr.length, 0) : 0;

export default function WatchedSummary({ watched }) {
  const avgWatchTime = average(watched.map((m) => m.runtime));
  const avgRating = average(watched.map((m) => m.imdbRating));

  return (
    <Card className="mb-6">
      <CardContent className="grid grid-cols-3 gap-3 sm:gap-6">
        <Stat label="Films" value={watched.length} />
        <Stat label="Avg rating" value={avgRating.toFixed(1)} />
        <Stat label="Avg runtime" value={`${avgWatchTime.toFixed(0)}m`} />
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-micro">{label}</span>
      <span
        className="text-foreground font-semibold leading-none"
        style={{ fontSize: "clamp(20px, 5vw, 28px)", letterSpacing: "-0.02em" }}
      >
        {value}
      </span>
    </div>
  );
}
