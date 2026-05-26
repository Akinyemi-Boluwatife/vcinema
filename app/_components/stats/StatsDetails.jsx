import { Suspense } from "react";
import { BarChart3 } from "lucide-react";
import { getWatchedWithMetadata, aggregateStats } from "@/_lib/stats";
import { getAuthContext } from "@/_lib/auth";
import TasteProfileCard from "@/_components/stats/TasteProfileCard";
import KpiRow from "@/_components/stats/KpiRow";
import ChartCard from "@/_components/stats/ChartCard";
import MonthlyWatchChart from "@/_components/stats/MonthlyWatchChart";
import GenresOverTimeChart from "@/_components/stats/GenresOverTimeChart";
import RatingByGenreChart from "@/_components/stats/RatingByGenreChart";
import TopPeopleList from "@/_components/stats/TopPeopleList";
import StatsSkeleton from "@/_components/stats/StatsSkeleton";

async function StatsContent() {
  const { user } = await getAuthContext();
  const rows = await getWatchedWithMetadata();
  const stats = await aggregateStats(rows, user?.id ?? null);

  if (!stats) {
    return (
      <div className="flex flex-col items-center text-center py-20 px-4">
        <BarChart3 className="size-8 text-muted-foreground mb-4" aria-hidden />
        <p className="text-base font-medium text-foreground mb-1">
          No stats yet
        </p>
        <p className="text-sm text-muted-foreground">
          Mark some films as Watched to unlock your stats.
        </p>
      </div>
    );
  }

  return (
    <>
      <TasteProfileCard profile={stats.tasteProfile} />
      <KpiRow kpis={stats.kpis} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="md:col-span-2">
          <ChartCard title="Monthly watch" subtitle="Last 12 months">
            <MonthlyWatchChart data={stats.monthlyWatchCount} />
          </ChartCard>
        </div>
        <div>
          <ChartCard
            title="Avg rating by genre"
            subtitle="Genres with ≥ 2 rated films"
          >
            <RatingByGenreChart data={stats.avgRatingByGenre} />
          </ChartCard>
        </div>
      </div>

      <ChartCard
        title="Genres over time"
        subtitle="Stacked monthly distribution"
      >
        <GenresOverTimeChart
          data={stats.genresOverTime}
          genres={stats.topGenres}
        />
      </ChartCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TopPeopleList title="Top directors" people={stats.topDirectors} />
        <TopPeopleList title="Top actors" people={stats.topActors} />
      </div>
    </>
  );
}

export default function StatsDetails() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          Stats
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          The shape of your year.
        </p>
      </header>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsContent />
      </Suspense>
    </div>
  );
}
