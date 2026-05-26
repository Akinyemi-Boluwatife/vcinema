import { getWatchHistory, getWatchedYears } from "@/_lib/watchedMovies";
import { aggregateHistory } from "@/_lib/history";
import HistoryTimeline from "./HistoryTimeline";
import HistoryKpis from "./HistoryKpis";
import HeatmapCalendar from "./HeatmapCalendar";
import Pagination from "@/_components/shared/Pagination";
import MonthlyWatchChart from "@/_components/stats/MonthlyWatchChart";
import { Card, CardContent } from "@/components/ui/card";

const PER_PAGE = 10;

export default async function WatchHistoryView({ year, page = 1 }) {
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

  const totalPages = Math.max(1, Math.ceil(yearMovies.length / PER_PAGE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const timelineMovies = yearMovies.slice(start, start + PER_PAGE);

  if (!years.length) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <p className="text-base font-medium text-foreground mb-1">
            No watch history yet
          </p>
          <p className="text-sm text-muted-foreground">
            Mark a movie as Watched to start building your history.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">


      <HistoryKpis
        total={history.total}
        bestMonth={history.bestMonth}
        bestDay={history.bestDay}
        streak={history.streak}
      />

      <Card>
        <CardContent>
          <h2 className="text-base font-medium text-foreground mb-1">
            By month
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            {resolvedYear}
          </p>
          <div style={{ height: 200 }}>
            <MonthlyWatchChart data={history.byMonth} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="text-base font-medium text-foreground mb-1">
            Daily activity
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            {resolvedYear}
          </p>
          <HeatmapCalendar year={resolvedYear} byDay={history.byDay} />
        </CardContent>
      </Card>

      {history.total === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-6">
          No movies watched in {resolvedYear} yet.
        </p>
      ) : (
        <>
          <HistoryTimeline movies={timelineMovies} />
          <Pagination total={yearMovies.length} perPage={PER_PAGE} />
        </>
      )}
    </div>
  );
}
