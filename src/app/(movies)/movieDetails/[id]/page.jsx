import { getMovieDetails } from "../../actions";
import MovieDetailClient from "./MovieDetailClient";

export const metadata = {
  title: "movie Details",
};

export default async function MovieDetailsPage({ params }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <MovieDetailClient movie={movie} movieId={id} />
    </div>
  );
}
