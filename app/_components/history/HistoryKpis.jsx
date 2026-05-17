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
    { label: "Films", value: total },
    {
      label: "Best Month",
      value: bestMonth ? `${bestMonth.label} (${bestMonth.count})` : "—",
    },
    {
      label: "Best Day",
      value: bestDay ? `${formatDate(bestDay.date)} (${bestDay.count})` : "—",
    },
    { label: "Streak", value: streak ? `${streak} day${streak === 1 ? "" : "s"}` : "—" },
  ];

  return (
    <div className="flex gap-3 p-4 mb-4 bg-surface-high rounded-lg border border-outline-variant/30 overflow-x-auto">
      {items.map((it, i) => (
        <div key={it.label} className="flex flex-1 items-stretch min-w-[110px]">
          <div className="text-center flex-1">
            <p className="text-primary text-lg font-bold whitespace-nowrap">
              {it.value}
            </p>
            <p className="text-on-surface-variant text-[10px] uppercase tracking-widest mt-0.5">
              {it.label}
            </p>
          </div>
          {i < items.length - 1 && <div className="w-px bg-outline-variant/40 ml-3" />}
        </div>
      ))}
    </div>
  );
}
