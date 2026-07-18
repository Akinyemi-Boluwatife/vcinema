import { createAnonClient } from "./supabase";
import { auth } from "./auth";

export function toCollection(row, extra = {}) {
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

function toItem(row) {
  return {
    imdbID: row.imdb_id,
    title: row.title,
    poster: row.poster,
    year: row.year,
    position: row.position,
  };
}

export async function getMyCollection(id) {
  const { supabase, user } = await auth();
  if (!user) return null;

  const { data: row } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!row) return null;

  const { data: items } = await supabase
    .from("collection_items")
    .select("*")
    .eq("collection_id", id)
    .order("position", { ascending: true });

  return toCollection(row, { items: (items ?? []).map(toItem) });
}

export async function getPublicCollectionBySlug(slug) {
  if (!slug) return null;
  await auth();
  const supabase = createAnonClient();

  const { data: row } = await supabase
    .from("collections")
    .select("*")
    .eq("public_slug", slug)
    .eq("is_public", true)
    .maybeSingle();
  if (!row) return null;

  const { data: items } = await supabase
    .from("collection_items")
    .select("*")
    .eq("collection_id", row.id)
    .order("position", { ascending: true });

  return toCollection(row, { items: (items ?? []).map(toItem) });
}
