"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HiClipboard, HiCheck } from "react-icons/hi2";
import { togglePublic } from "@/_lib/collections";

export default function PublicToggle({ collectionId, initialPublic, initialSlug }) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [slug, setSlug] = useState(initialSlug);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        const res = await togglePublic(collectionId);
        setIsPublic(res.isPublic);
        setSlug(res.publicSlug);
        router.refresh();
      } catch {}
    });
  }

  async function copyLink() {
    if (typeof window === "undefined" || !slug) return;
    const url = `${window.location.origin}/c/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  const publicUrl =
    typeof window !== "undefined" && slug ? `${window.location.origin}/c/${slug}` : "";

  return (
    <div className="bg-surface-high rounded-xl border border-outline-variant/30 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-on-surface text-sm font-semibold">Public link</p>
          <p className="text-on-surface-variant text-xs">
            {isPublic ? "Anyone with the link can view this list." : "This list is private."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          role="switch"
          aria-checked={isPublic}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 border-none cursor-pointer disabled:opacity-50 ${
            isPublic ? "bg-primary" : "bg-surface-variant"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-on-primary transition-transform duration-200 ${
              isPublic ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {isPublic && slug && (
        <div className="flex items-center gap-2 bg-surface-low rounded-lg p-2 border border-outline-variant/30">
          <code className="text-on-surface-variant text-xs flex-1 truncate">{publicUrl}</code>
          <button
            type="button"
            onClick={copyLink}
            className="text-on-surface-variant hover:text-on-surface bg-transparent border-none p-1 cursor-pointer"
            aria-label="Copy link"
          >
            {copied ? <HiCheck className="text-base" /> : <HiClipboard className="text-base" />}
          </button>
        </div>
      )}
    </div>
  );
}
