"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createServerSupabase } from "./supabase";

const MIN_PASSWORD = 8;
const API_KEY = process.env.OMDB_API_KEY;

export async function signInWithGoogle() {
  const supabase = await createServerSupabase();
  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback?next=/searchMovies` },
  });
  if (error) return { error: error.message };
  if (data?.url) redirect(data.url);
}

export async function signInWithCredentials({ email, password }) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { error: "Invalid email or password." };
  redirect("/searchMovies");
}

export async function signUpWithCredentials({ name, email, password }) {
  if (!password || password.length < MIN_PASSWORD) {
    return { error: `Password must be at least ${MIN_PASSWORD} characters.` };
  }
  const supabase = await createServerSupabase();
  const origin = (await headers()).get("origin");
  const { error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { name: name?.trim() || null },
      emailRedirectTo: `${origin}/auth/callback?next=/searchMovies`,
    },
  });
  if (error) return { error: error.message };
  return { ok: true, message: "Check your email to confirm your account." };
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/signin");
}

export async function requestPasswordReset({ email }) {
  const supabase = await createServerSupabase();
  const origin = (await headers()).get("origin");
  await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${origin}/reset-password`,
  });
  return {
    ok: true,
    message: "If that email exists, a reset link is on its way.",
  };
}

export async function setNewPassword({ password }) {
  if (!password || password.length < MIN_PASSWORD) {
    return { error: `Password must be at least ${MIN_PASSWORD} characters.` };
  }
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  redirect("/searchMovies");
}

export async function searchMovies(query) {
  if (!query || query.length < 3) return [];
  try {
    const res = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 } }
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
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Problem encountered when searching");
    const data = await res.json();
    if (data.Response === "False") throw new Error("Movie not found");
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
}
