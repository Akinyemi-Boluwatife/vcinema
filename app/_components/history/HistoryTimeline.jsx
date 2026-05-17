import Link from "next/link";
import EditWatchedDate from "./EditWatchedDate";

export default function HistoryTimeline({ movies }) {
  if (!movies.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mt-2">
        Recent activity
      </h2>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {movies.map((m) => (
          <li
            key={m.imdbID}
            className="flex items-center gap-3 bg-surface-high rounded-lg border border-outline-variant/30 p-2"
          >
            <Link
              href={`/movieDetails/${m.imdbID}`}
              className="shrink-0 no-underline"
            >
              {m.poster && m.poster !== "N/A" ? (
                <img
                  src={m.poster}
                  alt={m.title}
                  width={44}
                  height={64}
                  className="rounded-md object-cover w-[44px] h-[64px]"
                />
              ) : (
                <div className="w-[44px] h-[64px] rounded-md bg-surface-variant" />
              )}
            </Link>

            <div className="flex-1 min-w-0">
              <Link
                href={`/movieDetails/${m.imdbID}`}
                className="text-on-surface text-sm font-semibold no-underline truncate block hover:underline"
              >
                {m.title}
              </Link>
              <p className="text-on-surface-variant text-xs mb-1">
                {m.year}
                {m.runtime ? ` · ${m.runtime} min` : ""}
                {m.userRating ? ` · ★ ${m.userRating}/10` : ""}
              </p>
              <EditWatchedDate
                imdbID={m.imdbID}
                watchedAt={m.watchedAt}
                compact
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
