import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";
import { createServerSupabase } from "@/_lib/supabase";

export async function HomePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full blur-3xl opacity-25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-[360px] w-[360px] rounded-full blur-3xl opacity-15"
      />

      <div className="relative flex flex-col items-center text-center max-w-xl">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[0.95]">
          <span className="block text-on-surface">Watch.</span>
          <span className="block text-on-surface">Rate.</span>
          <span className="block ">Remember.</span>
        </h1>

        <p className="mt-10 text-on-surface-variant text-base sm:text-lg max-w-sm leading-relaxed">
          Your personal movie companion — clean, fast, and made for film lovers.
        </p>

        <Link
          href="/searchMovies"
          className="group mt-10 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-on-surface text-background text-sm font-semibold no-underline hover:opacity-90 transition-all duration-200"
        >
          {user ? "Go to app" : "Get started"}
          <HiArrowRight className="text-base transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>

        {!user && (
          <p className="mt-6 text-xs text-on-surface-variant/60">
            <Link
              href="/signin"
              className="underline underline-offset-2 hover:text-on-surface-variant transition-colors"
            >
              Sign in
            </Link>{" "}
            to save your watchlist
          </p>
        )}
      </div>
    </section>
  );
}
