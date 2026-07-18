import { cache } from "react";
import { createAnonClient } from "./supabase";
import { auth } from "./auth";

const RESERVED = Object.freeze(new Set([
  "admin",
  "api",
  "auth",
  "c",
  "u",
  "signin",
  "signup",
  "signout",
  "forgot-password",
  "reset-password",
  "searchmovies",
  "watchedmovies",
  "moviedetails",
  "stats",
  "lists",
  "profile",
  "settings",
  "about",
  "help",
  "support",
  "terms",
  "privacy",
  "_next",
  "favicon",
]));

const USERNAME_RE = /^[a-z0-9_-]{3,24}$/;
const STORAGE_PUBLIC_PREFIX = "/storage/v1/object/public/avatars/";

function ownedAvatarPath(url) {
  if (typeof url !== "string") return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const expected = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  if (parsed.host !== expected.host) return null;
  if (!parsed.pathname.startsWith(STORAGE_PUBLIC_PREFIX)) return null;
  return parsed.pathname.slice(STORAGE_PUBLIC_PREFIX.length) || null;
}

async function validateUsername(raw) {
  const value = (raw ?? "").trim().toLowerCase();
  if (!USERNAME_RE.test(value)) {
    return {
      ok: false,
      error: "3–24 chars, letters, numbers, underscore or hyphen only.",
    };
  }
  if (RESERVED.has(value)) {
    return { ok: false, error: "That username is reserved." };
  }
  return { ok: true, value };
}

function toProfile(row) {
  return {
    id: row.id,
    name: row.name ?? null,
    image: row.image ?? null,
    username: row.username ?? null,
    isPublic: !!row.is_public,
    showWatched: !!row.show_watched,
    showStats: !!row.show_stats,
    createdAt: row.created_at,
  };
}

function toWatched(row) {
  return {
    imdbID: row.imdb_id,
    title: row.title,
    poster: row.poster,
    year: row.year,
    imdbRating: row.imdb_rating,
    userRating: row.user_rating,
    runtime: row.runtime,
    status: row.status,
    genres: row.genres ?? [],
    director: row.director ?? null,
    actors: row.actors ?? [],
    watchedAt: row.watched_at ?? null,
  };
}

function toCollection(row, extra = {}) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description ?? "",
    isPublic: !!row.is_public,
    publicSlug: row.public_slug ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    ...extra,
  };
}


export const getMyProfile = cache(async () => {
  const { supabase, user } = await auth();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return data ? toProfile(data) : null;
});

export async function updateMyProfile({
  username,
  isPublic,
  showWatched,
  showStats,
}) {
  const { supabase, user } = await auth();
  if (!user) return { error: "Not authenticated." };

  const patch = { updated_at: new Date().toISOString() };

  if (username !== undefined && username !== null && username !== "") {
    const v = await validateUsername(username);
    if (!v.ok) return { error: v.error };
    patch.username = v.value;
  } else if (username === null || username === "") {
    patch.username = null;
  }

  if (isPublic !== undefined) patch.is_public = !!isPublic;
  if (showWatched !== undefined) patch.show_watched = !!showWatched;
  if (showStats !== undefined) patch.show_stats = !!showStats;

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Username already taken." };
    }
    return { error: error.message };
  }
  return { ok: true };
}

export const getPublicProfileByUsername = cache(async (username) => {
  if (!username) return null;
  await auth();
  const value = String(username).trim().toLowerCase();
  if (!USERNAME_RE.test(value)) return null;

  const supabase = createAnonClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", value)
    .eq("is_public", true)
    .maybeSingle();
  return data ? toProfile(data) : null;
});

export const getPublicWatched = cache(async (username) => {
  await auth();
  const profile = await getPublicProfileByUsername(username);
  if (!profile || !profile.showWatched) return [];

  const supabase = createAnonClient();
  const { data } = await supabase
    .from("watched_movies")
    .select("*")
    .eq("user_id", profile.id)
    .eq("status", "watched")
    .order("watched_at", { ascending: false, nullsFirst: false });
  return (data ?? []).map(toWatched);
});

export const getPublicCollections = cache(async (username) => {
  await auth();
  const profile = await getPublicProfileByUsername(username);
  if (!profile) return [];

  const supabase = createAnonClient();

  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("updated_at", { ascending: false });

  const rows = collections ?? [];
  if (!rows.length) return [];

  const ids = rows.map((r) => r.id);
  const { data: items } = await supabase
    .from("collection_items")
    .select("collection_id, poster, position")
    .in("collection_id", ids)
    .order("position", { ascending: true });

  const meta = new Map();
  for (const id of ids) meta.set(id, { count: 0, coverPoster: null });
  for (const it of items ?? []) {
    const m = meta.get(it.collection_id);
    if (!m) continue;
    m.count += 1;
    if (m.coverPoster == null && it.poster && it.poster !== "N/A") {
      m.coverPoster = it.poster;
    }
  }

  return rows.map((r) =>
    toCollection(r, {
      itemCount: meta.get(r.id).count,
      coverPoster: meta.get(r.id).coverPoster,
    })
  );
});

export async function setMyAvatar({ publicUrl, storagePath }) {
  const { supabase, user } = await auth();
  if (!user) return { error: "Not authenticated." };

  if (!storagePath || !storagePath.startsWith(`${user.id}/`)) {
    return { error: "Invalid avatar path." };
  }
  if (typeof publicUrl !== "string" || !ownedAvatarPath(publicUrl)) {
    return { error: "Invalid avatar URL." };
  }

  const [{ data: prev }, { error }] = await Promise.all([
    supabase
      .from("profiles")
      .select("image")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .update({ image: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", user.id),
  ]);
  if (error) return { error: error.message };

  const oldPath = ownedAvatarPath(prev?.image);
  if (oldPath && oldPath !== storagePath) {
    await supabase.storage.from("avatars").remove([oldPath]);
  }
  return { ok: true };
}

export async function removeMyAvatar() {
  const { supabase, user } = await auth();
  if (!user) return { error: "Not authenticated." };

  const [{ data: prev }, { error }] = await Promise.all([
    supabase
      .from("profiles")
      .select("image")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .update({ image: null, updated_at: new Date().toISOString() })
      .eq("id", user.id),
  ]);
  if (error) return { error: error.message };

  const oldPath = ownedAvatarPath(prev?.image);
  if (oldPath) await supabase.storage.from("avatars").remove([oldPath]);
  return { ok: true };
}
