"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { createBrowserSupabase } from "@/_lib/supabase-browser";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
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
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  // Google's real button renders here, but it is never shown — see below.
  const hiddenButtonRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!scriptReady || !mounted || !hiddenButtonRef.current) return;
    if (!CLIENT_ID) {
      setError("Google sign-in is not configured.");
      return;
    }

    let cancelled = false;

    (async () => {
      const { nonce, hashedNonce } = await createNoncePair();
      if (cancelled || !hiddenButtonRef.current) return;

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

      // Google renders a different button depending on the browser's Google
      // session state — a plain "Continue with Google" bar, or (when the user
      // is already signed into Google) a personalized "Continue as X" card.
      // Both use Google's own internal, undocumented, unstable class names, so
      // there is no reliable way to restyle them to match this app. Instead we
      // never show this button at all: it renders into a real, laid-out but
      // visually hidden node, and our own dark button (below) forwards a real
      // click to it. Size/theme are irrelevant since it's never seen.
      window.google.accounts.id.renderButton(hiddenButtonRef.current, {
        type: "standard",
        width: 300,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [scriptReady, mounted, next, router]);

  function handleClick() {
    const target = hiddenButtonRef.current?.querySelector(
      '[role="button"]'
    );
    target?.click();
  }

  return (
    <div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      {/* Real Google button: off-screen, non-interactive to the user (inert),
          hidden from assistive tech. Our visible button below forwards a real
          click to it synchronously, inside the same user gesture, so Google's
          account picker / FedCM prompt still opens normally. */}
      <div
        ref={hiddenButtonRef}
        inert
        aria-hidden="true"
        className="absolute opacity-0 -z-10"
        style={{ pointerEvents: "none" }}
      />

      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={!scriptReady || !mounted || isPending || !!error}
        className="w-full h-11 text-sm font-medium"
      >
        <FcGoogle className="text-xl shrink-0" aria-hidden />
        {isPending ? "Signing in…" : "Continue with Google"}
      </Button>

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
