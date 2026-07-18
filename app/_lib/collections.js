"use server";
import { auth } from "./auth";
import { generateSlug } from "./slug";
import { toCollection } from "./collections-data";

async function trySlug(supabase, id, userId, remaining = 3) {
  if (remaining <= 0) throw new Error("Could not generate unique slug");
  const slug = generateSlug();
  const { error } = await supabase
    .from("collections")
    .update({
      is_public: true,
      public_slug: slug,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId);
  if (!error) return { isPublic: true, publicSlug: slug };
  if (error.code !== "23505") throw new Error(error.message);
  return trySlug(supabase, id, userId, remaining - 1);
}

export async function listMyCollections() {
  const { supabase, user } = await auth();
  if (!user) return [];

  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const rows = collections ?? [];
  if (!rows.length) return [];

  const ids = rows.map((r) => r.id);
  const { data: items } = await supabase
    .from("collection_items")
    .select("collection_id, imdb_id, poster, position")
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
}

export async function createCollection({ title, description }) {
  const { supabase, user } = await auth();
  if (!user) throw new Error("Not authenticated");
  const clean = (title ?? "").trim().slice(0, 120);
  if (!clean) throw new Error("Title required");

  const { data, error } = await supabase
    .from("collections")
    .insert({
      user_id: user.id,
      title: clean,
      description: (description ?? "").trim().slice(0, 500) || null,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function deleteCollection(id) {
  const { supabase, user } = await auth();
  if (!user) throw new Error("Not authenticated");
  await supabase
    .from("collections")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
}

export async function togglePublic(id) {
  const { supabase, user } = await auth();
  if (!user) throw new Error("Not authenticated");

  const { data: row } = await supabase
    .from("collections")
    .select("is_public")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!row) throw new Error("Not found");

  if (row.is_public) {
    await supabase
      .from("collections")
      .update({
        is_public: false,
        public_slug: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);
    return { isPublic: false, publicSlug: null };
  }

  return trySlug(supabase, id, user.id);
}

export async function addItem(collectionId, item) {
  const { supabase, user } = await auth();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase.rpc("collection_add_item", {
    p_collection_id: collectionId,
    p_imdb_id: item.imdbID,
    p_title: item.title ?? "Untitled",
    p_poster: item.poster && item.poster !== "N/A" ? item.poster : null,
    p_year: item.year ?? null,
  });
  if (error) throw new Error(error.message);
  return { added: data === true };
}

export async function removeItem(collectionId, imdbID) {
  const { supabase, user } = await auth();
  if (!user) throw new Error("Not authenticated");

  const { data: owns } = await supabase
    .from("collections")
    .select("id")
    .eq("id", collectionId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!owns) throw new Error("Not found");

  await supabase
    .from("collection_items")
    .delete()
    .eq("collection_id", collectionId)
    .eq("imdb_id", imdbID);
  await supabase
    .from("collections")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", collectionId)
    .eq("user_id", user.id);
}

export async function reorderItems(collectionId, orderedImdbIDs) {
  const { supabase, user } = await auth();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.rpc("collection_reorder", {
    p_collection_id: collectionId,
    p_ordered_imdb_ids: orderedImdbIDs,
  });
  if (error) throw new Error(error.message);
}
