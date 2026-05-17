import { getWatchHistory, getWatchedYears } from "@/_lib/watchedMovies";
import { aggregateHistory } from "@/_lib/history";
import HeatmapCalendar from "./HeatmapCalendar";
import HistoryTimeline from "./HistoryTimeline";
import HistoryKpis from "./HistoryKpis";
import YearSelector from "./YearSelector";
import MonthlyWatchChart from "@/_components/stats/MonthlyWatchChart";

export default async function WatchHistoryView({ year }) {
  const currentYear = new Date().getUTCFullYear();
  const [years, allWatched] = await Promise.all([
    getWatchedYears(),
    getWatchHistory(),
  ]);

  const resolvedYear =
    year && years.includes(year) ? year : (years[0] ?? currentYear);

  const history = aggregateHistory(allWatched, resolvedYear);
  const yearMovies = allWatched.filter((m) => {
    if (!m.watchedAt) return false;
    return new Date(m.watchedAt).getUTCFullYear() === resolvedYear;
  });
  const timelineMovies = yearMovies.slice(0, 20);

  const byDayObj = Object.fromEntries(history.byDay);

  if (!years.length) {
    return (
      <div className="bg-surface-high rounded-lg border border-outline-variant/30 p-8 text-center">
        <p className="text-on-surface text-base font-semibold mb-1">
          No watch history yet
        </p>
        <p className="text-on-surface-variant text-sm">
          Mark a movie as Watched to start building your history.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <YearSelector years={years} active={resolvedYear} />

      <HistoryKpis
        total={history.total}
        bestMonth={history.bestMonth}
        bestDay={history.bestDay}
        streak={history.streak}
      />

      <div className="bg-surface-high rounded-lg border border-outline-variant/30 p-4">
        <h2 className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-3">
          {resolvedYear} heatmap
        </h2>
        <HeatmapCalendar year={resolvedYear} byDay={byDayObj} />
      </div>

      <div className="bg-surface-high rounded-lg border border-outline-variant/30 p-4">
        <h2 className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-3">
          By month
        </h2>
        <div style={{ height: 200 }}>
          <MonthlyWatchChart data={history.byMonth} />
        </div>
      </div>

      {history.total === 0 ? (
        <p className="text-on-surface-variant text-sm text-center py-6">
          No movies watched in {resolvedYear} yet.
        </p>
      ) : (
        <HistoryTimeline movies={timelineMovies} />
      )}
    </div>
  );
}
