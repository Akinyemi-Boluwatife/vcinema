import MovieCard from "../ui/MovieCard";

export default function MovieList({ movies, statusMap = {} }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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
