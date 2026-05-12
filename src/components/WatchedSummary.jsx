const average = (arr) =>
  arr.reduce((acc, cur, _i, arr) => acc + cur / arr.length, 0);

export default function WatchedSummary({ watched }) {
  const avgWatchTime = average(watched.map((m) => m.runtime));
  const avgRating = average(watched.map((m) => m.imdbRating));

  return (
    <div className="flex gap-4 p-4 mb-4 bg-surface-high rounded-lg border border-outline-variant/30">
      <div className="text-center flex-1">
        <p className="text-primary text-xl font-bold">{watched.length}</p>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-0.5">Films</p>
      </div>
      <div className="w-px bg-outline-variant/40" />
      <div className="text-center flex-1">
        <p className="text-primary text-xl font-bold">⭐ {avgRating.toFixed(1)}</p>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-0.5">Avg Rating</p>
      </div>
      <div className="w-px bg-outline-variant/40" />
      <div className="text-center flex-1">
        <p className="text-primary text-xl font-bold">{avgWatchTime.toFixed(0)}m</p>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-0.5">Avg Runtime</p>
      </div>
    </div>
  );
}
