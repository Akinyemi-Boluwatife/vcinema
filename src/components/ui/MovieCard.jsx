import Link from 'next/link';

function PosterPlaceholder({ className }) {
  return (
    <div className={`flex items-center justify-center bg-surface-high text-on-surface-variant text-xs text-center p-2 ${className}`}>
      No Poster
    </div>
  );
}

function SearchCard({ movie }) {
  const { imdbID, Title, Year, Poster } = movie;
  const validPoster = Poster && Poster !== 'N/A' ? Poster : null;

  return (
    <Link href={`/movieDetails/${imdbID}`} className="no-underline group block">
      <div className="rounded-lg overflow-hidden bg-surface-low border border-outline-variant/30 hover:border-primary-container/50 transition-all duration-200 hover:shadow-glow-sm cursor-pointer">
        <div className="aspect-[2/3] overflow-hidden relative">
          {validPoster ? (
            <img
              src={validPoster}
              alt={Title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <PosterPlaceholder className="w-full h-full" />
          )}
        </div>
        <div className="p-2">
          <p className="font-semibold text-on-surface text-sm leading-tight line-clamp-2">{Title}</p>
          <p className="text-on-surface-variant text-xs mt-1">📅 {Year}</p>
        </div>
      </div>
    </Link>
  );
}

function WatchedCard({ movie }) {
  const { imdbID, title, poster, imdbRating, userRating, runtime } = movie;
  const validPoster = poster && poster !== 'N/A' ? poster : null;

  return (
    <Link href={`/movieDetails/${imdbID}`} className="no-underline block">
      <div className="flex gap-3 p-3 rounded-lg bg-surface-low border border-outline-variant/30 hover:border-outline-variant hover:bg-surface-mid transition-all duration-200 cursor-pointer">
        <div className="w-14 flex-shrink-0">
          {validPoster ? (
            <img
              src={validPoster}
              alt={title}
              className="w-full aspect-[2/3] object-cover rounded-md"
            />
          ) : (
            <PosterPlaceholder className="w-full aspect-[2/3] rounded-md" />
          )}
        </div>
        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
          <p className="font-semibold text-on-surface text-sm truncate">{title}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-on-surface-variant">
            {imdbRating > 0 && <span>⭐ {imdbRating}</span>}
            {userRating > 0 && <span className="text-primary">★ {userRating}/10</span>}
            {runtime > 0 && <span>⌛ {runtime}min</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function MovieCard({ movie, variant = 'search' }) {
  if (variant === 'watched') return <WatchedCard movie={movie} />;
  return <SearchCard movie={movie} />;
}
