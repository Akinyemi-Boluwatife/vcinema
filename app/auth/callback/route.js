import { NextResponse } from "next/server";
import { createServerSupabase } from "@/_lib/supabase";
import {
  PW_RECOVERY_COOKIE,
  PW_RECOVERY_MAX_AGE,
} from "@/_lib/auth-cookies";

const DEFAULT_NEXT = "/searchMovies";

function safeNext(value) {
  if (typeof value !== "string") return DEFAULT_NEXT;
  if (!value.startsWith("/") || value.startsWith("//")) return DEFAULT_NEXT;
  return value;
}

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const isRecovery = url.searchParams.get("recovery") === "1";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(`${url.origin}${next}`);
      if (isRecovery) {
        response.cookies.set(PW_RECOVERY_COOKIE, "1", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: PW_RECOVERY_MAX_AGE,
        });
      }
      return response;
    }
  }
  return NextResponse.redirect(
    `${url.origin}/signin?error=auth_callback_failed`
  );
}
