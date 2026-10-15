import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const expected = process.env.CRON_SECRET;
  if (expected && request.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, error: "supabase_not_configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`supabase responded ${res.status}`);

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("keepalive query failed:", err);
    return NextResponse.json(
      { ok: false, error: "query_failed", timestamp: new Date().toISOString() },
      { status: 500 },
    );
  }
}
