import { Card, CardContent } from "@/components/ui/card";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(`${dateStr}T00:00:00.000Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  });
}

export default function HistoryKpis({ total, bestMonth, bestDay, streak }) {
  const items = [
    { label: "Films", value: String(total), delta: null },
    {
      label: "Best month",
      value: bestMonth ? String(bestMonth.count) : "—",
      delta: bestMonth ? bestMonth.label : null,
    },
    {
      label: "Best day",
      value: bestDay ? String(bestDay.count) : "—",
      delta: bestDay ? formatDate(bestDay.date) : null,
    },
    {
      label: "Streak",
      value: streak ? String(streak) : "—",
      delta: streak ? (streak === 1 ? "day" : "days") : null,
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
