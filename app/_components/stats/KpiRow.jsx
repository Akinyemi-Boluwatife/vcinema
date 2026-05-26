import { Card, CardContent } from "@/components/ui/card";

function formatHours(min) {
  if (!min) return "0h";
  const h = Math.round(min / 60);
  return h >= 1000 ? `${(h / 1000).toFixed(1)}k h` : `${h}h`;
}

export default function KpiRow({ kpis }) {
  const items = [
    { label: "Films", value: String(kpis.totalFilms) },
    {
      label: "Avg rating",
      value: kpis.avgUserRating > 0 ? kpis.avgUserRating.toFixed(1) : "—",
      delta: kpis.totalFilms ? `across ${kpis.totalFilms} films` : null,
    },
    {
      label: "Total hours",
      value: formatHours(kpis.totalRuntimeMinutes),
      delta:
        kpis.totalRuntimeMinutes > 1440
          ? `${(kpis.totalRuntimeMinutes / 1440).toFixed(1)} days`
          : null,
    },
    {
      label: "Unique directors",
      value: String(kpis.distinctDirectors),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {items.map((it) => (
        <Card key={it.label} size="sm">
          <CardContent>
            <div className="flex flex-col gap-1.5">
              <span className="text-micro">{it.label}</span>
              <span
                className="text-foreground font-semibold leading-none"
                style={{ fontSize: 28, letterSpacing: "-0.02em" }}
              >
                {it.value}
              </span>
              {it.delta && (
                <span className="text-xs text-muted-foreground">
                  {it.delta}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
