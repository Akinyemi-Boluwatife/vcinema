function formatHours(min) {
  if (!min) return "0h";
  const h = Math.round(min / 60);
  return h >= 1000 ? `${(h / 1000).toFixed(1)}k h` : `${h}h`;
}

export default function KpiRow({ kpis }) {
  const items = [
    { label: "Films", value: kpis.totalFilms },
    {
      label: "Avg Rating",
      value: kpis.avgUserRating > 0 ? `★ ${kpis.avgUserRating.toFixed(1)}` : "—",
    },
    { label: "Total Time", value: formatHours(kpis.totalRuntimeMinutes) },
    { label: "Directors", value: kpis.distinctDirectors },
  ];

  return (
    <div className="flex gap-4 p-4 mb-4 bg-surface-high rounded-lg border border-outline-variant/30">
      {items.map((it, i) => (
        <div key={it.label} className="flex flex-1 items-stretch">
          <div className="text-center flex-1">
            <p className="text-primary text-xl font-bold">{it.value}</p>
            <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-0.5">
              {it.label}
            </p>
          </div>
          {i < items.length - 1 && <div className="w-px bg-outline-variant/40 ml-4" />}
        </div>
      ))}
    </div>
  );
}
