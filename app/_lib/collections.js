"use server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "../../auth";
import { createUserSupabaseClient } from "./supabase";
import { generateSlug } from "./slug";

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
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

function toItem(row) {
  return {
    imdbID: row.imdb_id,
    title: row.title,
    poster: row.poster,
    year: row.year,
    position: row.position,
  };
}

async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");
  return session;
}

export async function listMyCollections() {
  const session = await auth();
  if (!session?.user?.id) return [];
  const supabase = await createUserSupabaseClient(session.user.id);

  const { data: collections } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", session.user.id)
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

export async function getMyCollection(id) {
  const session = await auth();
  if (!session?.user?.id) return null;
  const supabase = await createUserSupabaseClient(session.user.id);

  const { data: row } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .eq("user_id", session.user.id)
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
  const supabase = anonClient();

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

export async function createCollection({ title, description }) {
  const session = await requireSession();
  const supabase = await createUserSupabaseClient(session.user.id);
  const clean = (title ?? "").trim().slice(0, 120);
  if (!clean) throw new Error("Title required");

  const { data, error } = await supabase
    .from("collections")
    .insert({
      user_id: session.user.id,
      title: clean,
      description: (description ?? "").trim().slice(0, 500) || null,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

export async function updateCollectionMeta(id, { title, description }) {
  const session = await requireSession();
  const supabase = await createUserSupabaseClient(session.user.id);
  const patch = { updated_at: new Date().toISOString() };
  if (title !== undefined) {
    const clean = title.trim().slice(0, 120);
    if (!clean) throw new Error("Title required");
    patch.title = clean;
  }
  if (description !== undefined) {
    patch.description = description.trim().slice(0, 500) || null;
  }
  await supabase
    .from("collections")
    .update(patch)
    .eq("id", id)
    .eq("user_id", session.user.id);
}

export async function deleteCollection(id) {
  const session = await requireSession();
  const supabase = await createUserSupabaseClient(session.user.id);
  await supabase
    .from("collections")
    .delete()
    .eq("id", id)
    .eq("user_id", session.user.id);
}

export async function togglePublic(id) {
  const session = await requireSession();
  const supabase = await createUserSupabaseClient(session.user.id);

  const { data: row } = await supabase
    .from("collections")
    .select("is_public")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (!row) throw new Error("Not found");

  if (row.is_public) {
    await supabase
      .from("collections")
      .update({ is_public: false, public_slug: null, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", session.user.id);
    return { isPublic: false, publicSlug: null };
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = generateSlug();
    const { error } = await supabase
      .from("collections")
      .update({ is_public: true, public_slug: slug, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", session.user.id);
    if (!error) return { isPublic: true, publicSlug: slug };
    if (error.code !== "23505") throw new Error(error.message);
  }
  throw new Error("Could not generate unique slug");
}

export async function addItem(collectionId, item) {
  const session = await requireSession();
  const supabase = await createUserSupabaseClient(session.user.id);

  const { data: owns } = await supabase
    .from("collections")
    .select("id")
    .eq("id", collectionId)
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (!owns) throw new Error("Not found");

  const { data: maxRow } = await supabase
    .from("collection_items")
    .select("position")
    .eq("collection_id", collectionId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextPos = (maxRow?.position ?? -1) + 1;

  await supabase
    .from("collection_items")
    .upsert(
      {
        collection_id: collectionId,
        imdb_id: item.imdbID,
        title: item.title ?? "Untitled",
        poster: item.poster && item.poster !== "N/A" ? item.poster : null,
        year: item.year ?? null,
        position: nextPos,
      },
      { onConflict: "collection_id,imdb_id", ignoreDuplicates: true }
    );

  await supabase
    .from("collections")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", collectionId)
    .eq("user_id", session.user.id);
}

export async function removeItem(collectionId, imdbID) {
  const session = await requireSession();
  const supabase = await createUserSupabaseClient(session.user.id);
  await supabase
    .from("collection_items")
    .delete()
    .eq("collection_id", collectionId)
    .eq("imdb_id", imdbID);
  await supabase
    .from("collections")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", collectionId)
    .eq("user_id", session.user.id);
}

export async function reorderItems(collectionId, orderedImdbIDs) {
  const session = await requireSession();
  const supabase = await createUserSupabaseClient(session.user.id);

  await Promise.all(
    orderedImdbIDs.map((imdbID, i) =>
      supabase
        .from("collection_items")
        .update({ position: i })
        .eq("collection_id", collectionId)
        .eq("imdb_id", imdbID)
    )
  );
  await supabase
    .from("collections")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", collectionId)
    .eq("user_id", session.user.id);
}
