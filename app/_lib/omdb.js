const API_KEY = process.env.OMDB_API_KEY;

export async function searchMovies(query) {
  if (!query || query.length < 3) return { items: [], error: null };
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error("Search is temporarily unavailable.");
    const data = await res.json();
    if (data.Response === "False") return { items: [], error: null };
    return { items: data.Search ?? [], error: null };
  } catch (err) {
    console.error("[omdb] searchMovies:", err);
    return { items: [], error: "Search is temporarily unavailable." };
  }
}

export async function getMovieDetails(id) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${encodeURIComponent(id)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error("Problem encountered when searching");
    const data = await res.json();
    if (data.Response === "False") throw new Error("Movie not found");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}
