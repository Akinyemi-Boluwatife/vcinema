import { useId } from "react";
import MovieCard from "../ui/MovieCard";

const EMPTY_STATUS_MAP = {};

export default function MovieRow({ title, movies, statusMap = EMPTY_STATUS_MAP }) {
  const headingId = useId();

  if (!movies?.length) return null;

  return (
    <section aria-labelledby={headingId} className="mb-10">
      <h2 id={headingId} className="text-lg font-semibold text-foreground mb-4">
        {title}
      </h2>
      <ul
        tabIndex={0}
        aria-label={title}
        className="-mx-4 px-4 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 sm:mx-0 sm:px-0 md:grid md:grid-cols-4 md:gap-x-4 md:gap-y-6 md:overflow-visible lg:grid-cols-5 xl:grid-cols-6"
      >
        {movies.map((movie) => (
          <li key={movie.imdbID} className="w-32 shrink-0 snap-start sm:w-36 md:w-auto">
            <MovieCard movie={movie} variant="search" status={statusMap[movie.imdbID]} />
          </li>
        ))}
      </ul>
    </section>
  );
}
