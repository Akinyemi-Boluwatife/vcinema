"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createBrowserSupabase } from "@/_lib/supabase-browser";
import { setProfileImage, removeProfileImage } from "@/_lib/actions";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXT_BY_MIME = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export default function AvatarUploader({
  userId,
  currentImage,
  name,
  username,
}) {
  const router = useRouter();
  const fileRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(currentImage ?? null);
  const initials = (name ?? username ?? "?").slice(0, 2).toUpperCase();

  function handlePick(e) {
    setError(null);
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED.has(file.type)) {
      setError("Use a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be 2 MB or smaller.");
      return;
    }

    const ext = EXT_BY_MIME[file.type];
    const path = `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    startTransition(async () => {
      const supabase = createBrowserSupabase();
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });
      if (upErr) {
        setError(upErr.message ?? "Upload failed. Try again.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      const result = await setProfileImage({ publicUrl, storagePath: path });
      if (result?.error) {
        await supabase.storage.from("avatars").remove([path]);
        setError(result.error);
        return;
      }
      setPreview(publicUrl);
      router.refresh();
    });
  }

  function handleRemove() {
    setError(null);
    startTransition(async () => {
      const result = await removeProfileImage();
      if (result?.error) {
        setError(result.error);
        return;
      }
      setPreview(null);
      router.refresh();
    });
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-5 flex-wrap">
        <Avatar className="size-20">
          {preview ? <AvatarImage src={preview} alt="" /> : null}
          <AvatarFallback className="text-2xl font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <p className="text-base font-medium text-foreground">Avatar</p>
          <p className="text-muted-foreground text-xs">
            JPG, PNG or WebP. 2 MB max.
          </p>
          <div className="flex gap-2 flex-wrap mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              disabled={isPending}
            >
              <Upload className="size-3.5" />
              {isPending ? "Uploading…" : preview ? "Change" : "Upload"}
            </Button>
            {preview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isPending}
              >
                <Trash2 className="size-3.5" />
                Remove
              </Button>
            )}
          </div>
          {error && <p className="text-destructive text-xs">{error}</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePick}
          />
        </div>
      </CardContent>
    </Card>
  );
}
