import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/_lib/supabase";

export async function GET(request) {
  const expected = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error) throw error;

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("keepalive query failed:", err);
    return NextResponse.json(
      { ok: false, error: "query_failed", timestamp: new Date().toISOString() },
      { status: 500 },
    );
  }
}
