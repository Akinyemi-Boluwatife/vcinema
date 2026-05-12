import MovieCard from './ui/MovieCard';

export default function WatchedMovieList({ watched }) {
  return (
    <div className="flex flex-col gap-2">
      {watched.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} variant="watched" />
      ))}
    </div>
  );
}
