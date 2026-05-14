import MovieCard from './ui/MovieCard';

export default function MovieList({ movies, statusMap = {} }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {movies?.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          variant="search"
          status={statusMap[movie.imdbID]}
        />
      ))}
    </div>
  );
}
