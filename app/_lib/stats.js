"use server";
import { createServerSupabase } from "./supabase";
import { getMovieDetails } from "./omdb";
import { generateTasteBlurb } from "./deepseek";

const BACKFILL_CONCURRENCY = 5;
const BACKFILL_RETRY_MS = 60 * 60 * 1000;

function splitOmdbList(value) {
  if (!value || typeof value !== "string" || value === "N/A") return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function rowToWatched(row) {
  return {
    imdbID: row.imdb_id,
    title: row.title,
    poster: row.poster,
    year: parseInt(row.year, 10) || null,
    imdbRating: row.imdb_rating ?? 0,
    userRating: row.user_rating ?? 0,
    runtime: row.runtime ?? 0,
    genres: row.genres ?? [],
    director: row.director ?? null,
    actors: row.actors ?? [],
    watchedAt: row.watched_at ?? row.updated_at ?? null,
  };
}

async function runWithConcurrency(items, limit, worker) {
  const results = [];
  let i = 0;
  const runners = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (i < items.length) {
        const idx = i++;
        try {
          results[idx] = await worker(items[idx], idx);
        } catch {
          results[idx] = null;
        }
      }
    },
  );
  await Promise.all(runners);
  return results;
}

export async function getWatchedWithMetadata() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("watched_movies")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "watched");

  const rows = data ?? [];
  if (!rows.length) return [];

  const retryAfter = Date.now() - BACKFILL_RETRY_MS;
  const missing = rows.filter((r) => {
    const lacksMetadata =
      !r.genres ||
      r.genres.length === 0 ||
      !r.director ||
      !r.actors ||
      r.actors.length === 0;
    if (!lacksMetadata) return false;
    const lastAttempt = r.metadata_backfill_attempted_at
      ? new Date(r.metadata_backfill_attempted_at).getTime()
      : 0;
    return lastAttempt < retryAfter;
  });

  if (missing.length) {
    await runWithConcurrency(missing, BACKFILL_CONCURRENCY, async (row) => {
      const attemptedAt = new Date().toISOString();
      const details = await getMovieDetails(row.imdb_id).catch(() => null);
      const patch = { metadata_backfill_attempted_at: attemptedAt };

      if (details) {
        const genres = splitOmdbList(details.Genre);
        const actors = splitOmdbList(details.Actors);
        const director =
          details.Director && details.Director !== "N/A"
            ? details.Director
            : null;

        row.genres = genres;
        row.director = director;
        row.actors = actors;
        patch.genres = genres;
        patch.director = director;
        patch.actors = actors;
      }

      await supabase
        .from("watched_movies")
        .update(patch)
        .eq("user_id", user.id)
        .eq("imdb_id", row.imdb_id);
    });
  }

  return rows.map(rowToWatched);
}

function monthKey(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function lastNMonths(n) {
  const out = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
    );
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    out.push(`${y}-${m}`);
  }
  return out;
}

function topN(map, n) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

export async function aggregateStats(rows, userId = null) {
  if (!rows.length) return null;

  const totalFilms = rows.length;
  const ratedRows = rows.filter((r) => r.userRating > 0);
  const avgUserRating =
    ratedRows.length > 0
      ? ratedRows.reduce((s, r) => s + r.userRating, 0) / ratedRows.length
      : 0;
  const totalRuntimeMinutes = rows.reduce((s, r) => s + (r.runtime || 0), 0);

  const directorCounts = new Map();
  for (const r of rows) {
    if (!r.director) continue;
    directorCounts.set(r.director, (directorCounts.get(r.director) || 0) + 1);
  }
  const distinctDirectors = directorCounts.size;

  const actorCounts = new Map();
  for (const r of rows) {
    for (const a of r.actors || []) {
      actorCounts.set(a, (actorCounts.get(a) || 0) + 1);
    }
  }

  const months = lastNMonths(12);
  const monthIndex = new Map(months.map((m, i) => [m, i]));
  const monthlyWatchCount = months.map((month) => ({ month, count: 0 }));
  for (const r of rows) {
    const k = monthKey(r.watchedAt);
    if (k && monthIndex.has(k)) {
      monthlyWatchCount[monthIndex.get(k)].count += 1;
    }
  }

  const genreTotals = new Map();
  for (const r of rows) {
    for (const g of r.genres || []) {
      genreTotals.set(g, (genreTotals.get(g) || 0) + 1);
    }
  }
  const topGenres = topN(genreTotals, 5).map(([g]) => g);

  const genresOverTime = months.map((month) => {
    const point = { month };
    for (const g of topGenres) point[g] = 0;
    return point;
  });
  for (const r of rows) {
    const k = monthKey(r.watchedAt);
    if (!k || !monthIndex.has(k)) continue;
    const idx = monthIndex.get(k);
    for (const g of r.genres || []) {
      if (topGenres.includes(g)) {
        genresOverTime[idx][g] += 1;
      }
    }
  }

  const genreRatingAccum = new Map();
  for (const r of rows) {
    if (!r.userRating) continue;
    for (const g of r.genres || []) {
      const cur = genreRatingAccum.get(g) || { sum: 0, count: 0 };
      cur.sum += r.userRating;
      cur.count += 1;
      genreRatingAccum.set(g, cur);
    }
  }
  const avgRatingByGenre = Array.from(genreRatingAccum.entries())
    .filter(([, v]) => v.count >= 2)
    .map(([genre, v]) => ({ genre, avg: v.sum / v.count, count: v.count }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 10);

  const topDirectors = topN(directorCounts, 10).map(([name, count]) => ({
    name,
    count,
  }));
  const topActors = topN(actorCounts, 10).map(([name, count]) => ({
    name,
    count,
  }));

  const decadeGenreAccum = new Map();
  for (const r of rows) {
    if (!r.userRating || !r.year) continue;
    const decade = Math.floor(r.year / 10) * 10;
    for (const g of r.genres || []) {
      const key = `${decade}|${g}`;
      const cur = decadeGenreAccum.get(key) || {
        sum: 0,
        count: 0,
        decade,
        genre: g,
      };
      cur.sum += r.userRating;
      cur.count += 1;
      decadeGenreAccum.set(key, cur);
    }
  }
  const tasteCandidates = Array.from(decadeGenreAccum.values())
    .filter((v) => v.count >= 3)
    .map((v) => ({ ...v, avg: v.sum / v.count }))
    .sort((a, b) => b.avg - a.avg);
  const top = tasteCandidates[0];

  // Fingerprint captures the inputs that actually drive the blurb:
  // top decade/genre, top-3 genres, top-3 directors, avg rating (±0.5 granularity).
  // The blurb is only regenerated when this string changes.
  const fingerprint = [
    top?.decade ?? "x",
    top?.genre ?? "x",
    topGenres.slice(0, 3).join(","),
    topDirectors
      .slice(0, 3)
      .map((d) => d.name)
      .join(","),
    Math.round(avgUserRating * 2) / 2,
  ].join("|");

  let blurb = top
    ? `A lover of ${top.decade}s ${top.genre.toLowerCase()}.`
    : "Eclectic — keep rating to see your profile take shape.";

  if (userId) {
    const supabase = await createServerSupabase();
    const { data: prof } = await supabase
      .from("profiles")
      .select("taste_blurb, taste_blurb_fingerprint")
      .eq("id", userId)
      .single();

    if (prof?.taste_blurb && prof.taste_blurb_fingerprint === fingerprint) {
      blurb = prof.taste_blurb;
    } else {
      const generated = await generateTasteBlurb({
        rows,
        topGenres,
        topDirectors,
        avgRating: avgUserRating,
        top,
      });
      if (generated) {
        blurb = generated;
        await supabase
          .from("profiles")
          .update({
            taste_blurb: generated,
            taste_blurb_fingerprint: fingerprint,
          })
          .eq("id", userId);
      }
    }
  }

  const tasteProfile = {
    blurb,
    decade: top?.decade ?? null,
    genre: top?.genre ?? null,
    avg: top?.avg,
    count: top?.count,
  };

  return {
    kpis: {
      totalFilms,
      avgUserRating,
      totalRuntimeMinutes,
      distinctDirectors,
    },
    monthlyWatchCount,
    genresOverTime,
    topGenres,
    avgRatingByGenre,
    topDirectors,
    topActors,
    tasteProfile,
  };
}
