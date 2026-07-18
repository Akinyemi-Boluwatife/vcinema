"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useTheme } from "next-themes";
import { createBrowserSupabase } from "@/_lib/supabase-browser";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const MAX_BUTTON_WIDTH = 400;
const DEFAULT_NEXT = "/searchMovies";

async function createNoncePair() {
  const nonce = crypto.randomUUID();
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(nonce)
  );
  const hashedNonce = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { nonce, hashedNonce };
}

export default function GoogleSignInButton({ next }) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const containerRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scriptReady || !mounted || !containerRef.current) return;
    if (!CLIENT_ID) {
      setError("Google sign-in is not configured.");
      return;
    }

    let cancelled = false;
    // Track the last width the button was rendered at. Rendering the button
    // changes the container's height, which re-fires ResizeObserver; without
    // this guard that feedback loop re-renders the button endlessly (a constant
    // flicker on mobile). We only re-render when the *button width* changes.
    let lastWidth = 0;

    async function render(width) {
      const { nonce, hashedNonce } = await createNoncePair();
      if (cancelled || !containerRef.current) return;

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        nonce: hashedNonce,
        use_fedcm_for_prompt: true,
        callback: async ({ credential }) => {
          setError(null);
          setIsPending(true);
          const supabase = createBrowserSupabase();
          const { error: signInError } = await supabase.auth.signInWithIdToken(
            { provider: "google", token: credential, nonce }
          );
          if (signInError) {
            setIsPending(false);
            setError(signInError.message);
            return;
          }
          router.push(next || DEFAULT_NEXT);
          router.refresh();
        },
      });

      containerRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(containerRef.current, {
        type: "standard",
        theme: resolvedTheme === "dark" ? "filled_black" : "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        logo_alignment: "left",
        width,
      });
    }

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.min(
        Math.round(entry.contentRect.width),
        MAX_BUTTON_WIDTH
      );
      // Ignore zero-width and height-only changes (the latter is the button's
      // own render feeding back into the observer).
      if (width <= 0 || width === lastWidth) return;
      lastWidth = width;
      render(width);
    });
    observer.observe(containerRef.current);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [scriptReady, mounted, resolvedTheme, next, router]);

  return (
    <div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      {scriptReady && mounted ? (
        <div ref={containerRef} className="gsi-button flex w-full justify-center" />
      ) : (
        <div className="h-11 w-full animate-pulse rounded-md bg-muted" aria-hidden />
      )}
      {isPending && !error && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Signing in…
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-center text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
