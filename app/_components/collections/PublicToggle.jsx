"use client";
import { useReducer, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Link2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { togglePublic } from "@/_lib/collections";

function init({ initialPublic, initialSlug }) {
  return {
    isPublic: initialPublic,
    slug: initialSlug,
    copied: false,
    error: null,
    copyError: null,
    origin: typeof window !== "undefined" ? window.location.origin : "",
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "TOGGLE_SUCCESS":
      return { ...state, isPublic: action.isPublic, slug: action.slug, error: null };
    case "TOGGLE_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "COPIED":
      return { ...state, copied: true, copyError: null };
    case "CLEAR_COPIED":
      return { ...state, copied: false };
    case "COPY_ERROR":
      return { ...state, copyError: action.payload };
    default:
      return state;
  }
}

export default function PublicToggle({
  collectionId,
  initialPublic,
  initialSlug,
}) {
  const { refresh } = useRouter();
  const [state, dispatch] = useReducer(reducer, { initialPublic, initialSlug }, init);
  const { isPublic, slug, copied, error, copyError, origin } = state;
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    dispatch({ type: "CLEAR_ERROR" });
    startTransition(async () => {
      try {
        const res = await togglePublic(collectionId);
        dispatch({ type: "TOGGLE_SUCCESS", isPublic: res.isPublic, slug: res.publicSlug });
        refresh();
      } catch (e) {
        dispatch({
          type: "TOGGLE_ERROR",
          payload: e.message || "Could not change visibility. Please try again.",
        });
      }
    });
  }

  async function copyLink() {
    if (!slug || !origin) return;
    const url = `${origin}/c/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      dispatch({ type: "COPIED" });
      setTimeout(() => dispatch({ type: "CLEAR_COPIED" }), 1500);
    } catch {
      dispatch({
        type: "COPY_ERROR",
        payload: "Couldn't copy. Long-press the link to copy manually.",
      });
    }
  }

  const publicUrl = slug ? `${origin}/c/${slug}` : "";

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Public collection
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isPublic
                ? "Anyone with the link can view this list."
                : "Only you can see this list."}
            </p>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={handleToggle}
            disabled={isPending}
            aria-label="Toggle public visibility"
          />
        </div>

        {isPublic && slug && (
          <div className="flex items-center gap-2">
            <div className="input-shell flex-1 h-9 min-w-0">
              <Link2 className="size-3.5 text-muted-foreground shrink-0" />
              <code className="text-xs text-muted-foreground font-mono truncate">
                {publicUrl}
              </code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              aria-label="Copy link"
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}
        {error && <p className="text-destructive text-xs">{error}</p>}
        {copyError && <p className="text-destructive text-xs">{copyError}</p>}
      </CardContent>
    </Card>
  );
}
