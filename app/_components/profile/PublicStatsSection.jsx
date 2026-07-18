import { getPublicWatched } from "@/_lib/profiles";
import { aggregateStats } from "@/_lib/stats";
import KpiRow from "@/_components/stats/KpiRow";
import PublicProfileSection from "./PublicProfileSection";

export default async function PublicStatsSection({ username, showStats }) {
  if (!showStats) return null;

  const watched = await getPublicWatched(username);
  if (!watched.length) return null;

  const stats = await aggregateStats(watched);
  if (!stats) return null;

  return (
    <PublicProfileSection title="Stats">
      <KpiRow kpis={stats.kpis} />
    </PublicProfileSection>
  );
}
