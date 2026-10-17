import { cache } from "react";
import { createServerSupabase } from "./supabase";

export const auth = cache(async () => {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const user = claims?.sub
    ? { id: claims.sub, email: claims.email ?? null }
    : null;
  return { supabase, user };
});
