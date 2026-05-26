import StatsSkeleton from "@/_components/stats/StatsSkeleton";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-8">
        <div className="h-8 w-16 rounded-md bg-muted animate-pulse mb-2" />
        <div className="h-4 w-44 rounded-md bg-muted animate-pulse" />
      </header>
      <StatsSkeleton />
    </div>
  );
}
