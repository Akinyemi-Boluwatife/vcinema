import { cache } from "react";
import { createServerSupabase } from "./supabase";

export const auth = cache(async () => {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
});
