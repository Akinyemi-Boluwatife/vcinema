import { getMovieDetails } from "@/_lib/omdb";
import { getMovieEntry } from "@/_lib/watchedMovies-data";
import MovieDetailClient from "./MovieDetailClient";
import AddToList from "@/_components/movieDetails/AddToList";
import AddToCollectionMenu from "@/_components/collections/AddToCollectionMenu";

export const metadata = {
  title: "Movie Details",
};

export default async function MovieDetailsPage({ params }) {
  const { id } = await params;
  const [movie, existingEntry] = await Promise.all([
    getMovieDetails(id),
    getMovieEntry(id),
  ]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <MovieDetailClient
        movie={movie}
        movieId={id}
        existingEntry={existingEntry}
      />

      <AddToList movie={movie} movieId={id} existingEntry={existingEntry} />
      <AddToCollectionMenu movie={movie} movieId={id} />
    </div>
  );
}
