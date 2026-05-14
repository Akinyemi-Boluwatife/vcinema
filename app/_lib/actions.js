"use server";
import { signIn, signOut } from "../../auth";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/searchMovies" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/signin" });
}
const API_KEY = process.env.OMDB_API_KEY;

export async function searchMovies(query) {
  if (!query || query.length < 3) return [];

  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error("Something went wrong when fetching movies");
    const data = await res.json();
    if (data.Response === "False") return [];
    return data.Search;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getMovieDetails(id) {
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`,
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
