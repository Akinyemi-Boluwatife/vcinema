import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import EditWatchedDate from "./EditWatchedDate";

export default function HistoryTimeline({ movies }) {
  if (!movies.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-medium text-foreground mt-2">
        Recent activity
      </h2>
      <ul className="flex flex-col gap-2 list-none p-0 m-0">
        {movies.map((m) => (
          <li key={m.imdbID}>
            <Card
              size="sm"
              className="flex flex-row items-center gap-3 p-3 hover:border-primary transition-colors"
            >
              <Link
                href={`/movieDetails/${m.imdbID}`}
                className="shrink-0 no-underline w-11"
              >
                <div className="poster rounded-sm">
                  {m.poster && m.poster !== "N/A" ? (
                    <img src={m.poster} alt={m.title} loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/movieDetails/${m.imdbID}`}
                  className="text-foreground text-sm font-medium no-underline truncate block hover:underline"
                >
                  {m.title}
                </Link>
                <p className="text-muted-foreground text-xs mb-1.5 mt-0.5">
                  {m.year}
                  {m.runtime ? ` · ${m.runtime} min` : ""}
                  {m.userRating ? (
                    <> · <Star className="inline size-3 fill-current mb-0.5" /> {m.userRating}/10</>
                  ) : ""}
                </p>
                <EditWatchedDate
                  imdbID={m.imdbID}
                  watchedAt={m.watchedAt}
                  compact
                />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
