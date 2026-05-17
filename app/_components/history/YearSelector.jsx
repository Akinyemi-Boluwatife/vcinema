import Link from "next/link";

export default function YearSelector({ years, active }) {
  if (!years.length) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {years.map((y) => {
        const isActive = y === active;
        return (
          <Link
            key={y}
            href={`/watchedMovies?tab=history&year=${y}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold no-underline border ${
              isActive
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-high text-on-surface-variant border-outline-variant/30 hover:text-on-surface"
            }`}
          >
            {y}
          </Link>
        );
      })}
    </div>
  );
}
