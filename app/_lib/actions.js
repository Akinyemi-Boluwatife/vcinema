"use server";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "./supabase";
import { updateMyProfile, setMyAvatar, removeMyAvatar } from "./profiles";
import { PW_RECOVERY_COOKIE } from "./auth-cookies";

const MIN_PASSWORD = 8;
const DEFAULT_NEXT = "/searchMovies";

function safeNext(value) {
  if (typeof value !== "string") return DEFAULT_NEXT;
  if (!value.startsWith("/") || value.startsWith("//")) return DEFAULT_NEXT;
  return value;
}

export async function signInWithGoogle(formData) {
  const next = safeNext(formData?.get?.("next"));
  const supabase = await createServerSupabase();
  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: error.message };
  if (data?.url) redirect(data.url);
}

export async function signInWithCredentials({ email, password, next }) {
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) return { error: "Invalid email or password." };
  redirect(safeNext(next));
}

export async function signUpWithCredentials({ name, email, password, next }) {
  if (!password || password.length < MIN_PASSWORD) {
    return { error: `Password must be at least ${MIN_PASSWORD} characters.` };
  }
  const supabase = await createServerSupabase();
  const origin = (await headers()).get("origin");
  const safe = safeNext(next);
  await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { name: name?.trim() || null },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(safe)}`,
    },
  });
  return { ok: true, message: "Check your email to confirm your account." };
}

export async function signOutAction() {
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect("/signin");
}

export async function requestPasswordReset({ email }) {
  const supabase = await createServerSupabase();
  const origin = (await headers()).get("origin");
  await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
    redirectTo: `${origin}/auth/callback?next=/reset-password&recovery=1`,
  });
  return {
    ok: true,
    message: "If that email exists, a reset link is on its way.",
  };
}

export async function setNewPassword({ password, currentPassword }) {
  if (!password || password.length < MIN_PASSWORD) {
    return { error: `Password must be at least ${MIN_PASSWORD} characters.` };
  }
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const cookieStore = await cookies();
  const isRecovery = cookieStore.get(PW_RECOVERY_COOKIE)?.value === "1";

  if (!isRecovery) {
    if (!currentPassword) {
      return { error: "Enter your current password to confirm the change." };
    }
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (verifyError) {
      return { error: "Current password is incorrect." };
    }
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  if (isRecovery) {
    cookieStore.delete(PW_RECOVERY_COOKIE);
  }
  redirect("/searchMovies");
}

export async function updateProfileSettings(values) {
  const result = await updateMyProfile(values);
  if (result?.error) return result;
  revalidatePath("/profile");
  if (values?.username)
    revalidatePath(`/u/${String(values.username).trim().toLowerCase()}`);
  return { ok: true };
}

export async function setProfileImage(values) {
  const result = await setMyAvatar(values);
  if (result?.error) return result;
  revalidatePath("/profile");
  revalidatePath("/u/[username]", "page");
  return { ok: true };
}

export async function removeProfileImage() {
  const result = await removeMyAvatar();
  if (result?.error) return result;
  revalidatePath("/profile");
  revalidatePath("/u/[username]", "page");
  return { ok: true };
}

