import { NextResponse } from "next/server";
import { createServerSupabase } from "@/_lib/supabase";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/searchMovies";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${url.origin}${next}`);
  }
  return NextResponse.redirect(
    `${url.origin}/signin?error=auth_callback_failed`
  );
}
