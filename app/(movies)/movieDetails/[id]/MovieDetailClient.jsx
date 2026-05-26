"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
      <div className="detail-backdrop relative -mx-4 sm:-mx-6 mb-0">
        {validPoster ? (
          <img src={validPoster} alt="" aria-hidden />
        ) : (
          <div className="absolute inset-0 bg-card" />
        )}
        <div className="absolute top-6 left-4 sm:left-6 z-10">
          <Button
            variant="outline"
            size="sm"
            className="h-8 backdrop-blur-md bg-background/60"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-3.5" />
            Back
          </Button>
        </div>
      </div>

      <div className="relative -mt-40 sm:-mt-48 z-10 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start">
        <div className="w-40 sm:w-52 flex-shrink-0">
          <div className="poster shadow-2xl">
            {validPoster ? (
              <img src={validPoster} alt={title} />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs text-center p-2">
                No Poster
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 flex-1 min-w-0 sm:pt-12">
          <p className="text-micro">
            {year}
            {runtime && runtime !== "N/A" ? ` · ${runtime}` : ""}
            {director && director !== "N/A" ? ` · Directed by ${director}` : ""}
          </p>
          <h1
            className="font-display text-foreground"
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              lineHeight: 1.05,
            }}
          >
            {title}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <Badge key={g} variant="outline" className="text-xs">
                {g}
              </Badge>
            ))}
          </div>
          {imdbRating && imdbRating !== "N/A" && (
            <div className="flex items-center gap-2 mt-1">
              <Star className="text-primary size-4 fill-primary" />
              <span className="font-medium text-foreground text-sm">
                {imdbRating}
              </span>
              <span className="text-muted-foreground text-xs">IMDb</span>
            </div>
          )}
        </div>
      </div>

      {plot && plot !== "N/A" && (
        <p className="text-muted-foreground text-base leading-relaxed mt-6 max-w-2xl">
          {plot}
        </p>
      )}

      {actors && actors !== "N/A" && (
        <p className="text-sm text-muted-foreground mt-4">
          <span className="text-foreground/70 font-medium">Cast: </span>
          {actors}
        </p>
      )}
    </div>
  );
}
