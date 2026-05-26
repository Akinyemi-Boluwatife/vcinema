import Link from "next/link";

export default function YearSelector({ years, active }) {
  if (!years.length) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-4">
      {years.map((y) => {
        const isActive = y === active;
        return (
          <Link
            key={y}
            href={`/watchedMovies?tab=history&year=${y}`}
            className={`h-8 inline-flex items-center px-3 rounded-md text-xs font-medium no-underline transition-colors ${
              isActive
                ? "bg-foreground text-background"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {y}
          </Link>
        );
      })}
    </div>
  );
}
