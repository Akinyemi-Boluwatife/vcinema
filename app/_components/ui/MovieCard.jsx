import Link from "next/link";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const STATUS_LABEL = {
  watched: "Watched",
  want_to_watch: "Want",
  dropped: "Dropped",
};

function PosterPlaceholder({ className }) {
  return (
    <div
      className={`flex items-center justify-center bg-muted text-muted-foreground text-xs text-center p-2 ${className}`}
    >
      No poster
    </div>
  );
}

function StatusOverlay({ status }) {
  if (!status || !STATUS_LABEL[status]) return null;
  return (
    <span
      className={`poster-overlay ${
        status === "watched"
          ? "poster-overlay--watched"
          : status === "dropped"
            ? "poster-overlay--dropped"
            : ""
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function SearchCard({ movie, status }) {
  const { imdbID, Title, Year, Poster } = movie;
  const validPoster = Poster && Poster !== "N/A" ? Poster : null;

  return (
    <Link
      href={`/movieDetails/${imdbID}`}
      className="no-underline group block"
    >
      <div className="poster">
        {validPoster ? (
          <img src={validPoster} alt={Title} loading="lazy" />
        ) : (
          <PosterPlaceholder className="w-full h-full" />
        )}
        <StatusOverlay status={status} />
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-sm text-foreground leading-tight line-clamp-2">
          {Title}
        </p>
        <p className="text-xs text-muted-foreground mt-1">{Year}</p>
      </div>
    </Link>
  );
}

function formatWatchedAt(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function WatchedCard({ movie }) {
  const {
    imdbID,
    title,
    poster,
    imdbRating,
    userRating,
    runtime,
    status,
    watchedAt,
  } = movie;
  const validPoster = poster && poster !== "N/A" ? poster : null;
  const watchedDate = status === "watched" ? formatWatchedAt(watchedAt) : null;

  return (
    <Link href={`/movieDetails/${imdbID}`} className="no-underline block">
      <Card
        size="sm"
        className="flex flex-row items-stretch gap-3 p-3 bg-card hover:border-primary transition-colors rounded-lg"
      >
        <div className="w-14 flex-shrink-0">
          <div className="poster rounded-sm">
            {validPoster ? (
              <img src={validPoster} alt={title} loading="lazy" />
            ) : (
              <PosterPlaceholder className="w-full h-full" />
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
          <p className="font-medium text-foreground text-sm truncate">
            {title}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            {imdbRating > 0 && (
              <span className="flex items-center gap-0.5">
                <Star className="size-3 fill-current" />
                {imdbRating}
              </span>
            )}
            {status === "watched" && userRating > 0 && (
              <span className="text-primary font-medium">
                Your rating · {userRating}/10
              </span>
            )}
            {runtime > 0 && <span>{runtime}m</span>}
            {watchedDate && <span>{watchedDate}</span>}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function MovieCard({ movie, variant = "search", status }) {
  if (variant === "watched") return <WatchedCard movie={movie} />;
  return <SearchCard movie={movie} status={status} />;
}
