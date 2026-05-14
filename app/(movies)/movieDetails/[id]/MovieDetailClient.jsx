"use client";

import { useRouter } from "next/navigation";
import Badge from "@/_components/ui/Badge";

export default function MovieDetailClient({ movie }) {
  const router = useRouter();

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Plot: plot,
    Runtime: runtime,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbRating,
  } = movie;

  const validPoster = poster && poster !== "N/A" ? poster : null;
  const genres = genre && genre !== "N/A" ? genre.split(", ") : [];

  return (
    <div className="pb-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-sm mb-5 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
      >
        ← Back
      </button>

      <div className="flex gap-4 mb-6">
        <div className="w-32 flex-shrink-0 sm:w-40">
          {validPoster ? (
            <img
              src={validPoster}
              alt={title}
              className="w-full aspect-[2/3] object-cover rounded-lg"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-surface-high rounded-lg flex items-center justify-center text-on-surface-variant text-xs text-center p-2">
              No Poster
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0 py-1">
          <h1 className="font-bold text-on-surface text-xl leading-tight">
            {title}
          </h1>
          <p className="text-on-surface-variant text-sm">
            {year} · {runtime}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <Badge key={g} variant="default">
                {g}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-auto">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="font-bold text-on-surface text-sm">
              {imdbRating}
            </span>
            <span className="text-on-surface-variant text-xs">IMDB</span>
          </div>
        </div>
      </div>

      {plot && plot !== "N/A" && (
        <div className="mb-6">
          <h2 className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest mb-2">
            Plot
          </h2>
          <p className="text-on-surface text-sm leading-relaxed">{plot}</p>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3">
        {director && director !== "N/A" && (
          <div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest">
              Director
            </p>
            <p className="text-on-surface text-sm mt-1">{director}</p>
          </div>
        )}
        {actors && actors !== "N/A" && (
          <div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-widest">
              Cast
            </p>
            <p className="text-on-surface text-sm mt-1">{actors}</p>
          </div>
        )}
      </div>
    </div>
  );
}
