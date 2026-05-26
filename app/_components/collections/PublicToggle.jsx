"use client";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Link2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { togglePublic } from "@/_lib/collections";

export default function PublicToggle({
  collectionId,
  initialPublic,
  initialSlug,
}) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [slug, setSlug] = useState(initialSlug);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [copyError, setCopyError] = useState(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await togglePublic(collectionId);
        setIsPublic(res.isPublic);
        setSlug(res.publicSlug);
        router.refresh();
      } catch (e) {
        setError(e.message || "Could not change visibility. Please try again.");
      }
    });
  }

  async function copyLink() {
    if (!slug || !origin) return;
    setCopyError(null);
    const url = `${origin}/c/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopyError("Couldn't copy. Long-press the link to copy manually.");
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
