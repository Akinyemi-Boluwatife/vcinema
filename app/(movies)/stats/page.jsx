import { getWatchedWithMetadata, aggregateStats } from "@/_lib/stats";
import TasteProfileCard from "@/_components/stats/TasteProfileCard";
import KpiRow from "@/_components/stats/KpiRow";
import ChartCard from "@/_components/stats/ChartCard";
import MonthlyWatchChart from "@/_components/stats/MonthlyWatchChart";
import GenresOverTimeChart from "@/_components/stats/GenresOverTimeChart";
import RatingByGenreChart from "@/_components/stats/RatingByGenreChart";
import TopPeopleList from "@/_components/stats/TopPeopleList";

export const metadata = {
  title: "Stats & Analytics",
};

export default async function StatsPage() {
  const rows = await getWatchedWithMetadata();
  const stats = await aggregateStats(rows);

  if (!stats) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-5xl">📊</span>
          <p className="text-on-surface-variant text-sm text-center">
            Mark some movies as Watched to unlock your stats.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <TasteProfileCard profile={stats.tasteProfile} />
      <KpiRow kpis={stats.kpis} />

      <ChartCard title="Monthly watch count" subtitle="Last 12 months">
        <MonthlyWatchChart data={stats.monthlyWatchCount} />
      </ChartCard>

      <ChartCard title="Genres watched over time" subtitle="Top 5 genres, stacked">
        <GenresOverTimeChart data={stats.genresOverTime} genres={stats.topGenres} />
      </ChartCard>

      <ChartCard title="Average rating by genre" subtitle="Genres with ≥ 2 rated films">
        <RatingByGenreChart data={stats.avgRatingByGenre} />
      </ChartCard>

      <div className="flex flex-col sm:flex-row gap-4">
        <TopPeopleList title="Most-watched directors" people={stats.topDirectors} />
        <TopPeopleList title="Most-watched actors" people={stats.topActors} />
      </div>
    </div>
  );
}
