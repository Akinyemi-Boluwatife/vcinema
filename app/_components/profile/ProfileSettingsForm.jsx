"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AvatarUploader from "./AvatarUploader";
import { updateProfileSettings } from "@/_lib/actions";
import { useTheme } from "next-themes";

const USERNAME_RE = /^[a-z0-9_-]{3,24}$/;

export default function ProfileSettingsForm({ initial }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [savedMessage, setSavedMessage] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: initial.username ?? "",
      isPublic: !!initial.isPublic,
      showWatched: !!initial.showWatched,
      showStats: !!initial.showStats,
    },
  });

  const isPublic = watch("isPublic");

  const onSubmit = (values) => {
    setSavedMessage(null);
    startTransition(async () => {
      const result = await updateProfileSettings({
        username: values.username.trim().toLowerCase(),
        isPublic: !!values.isPublic,
        showWatched: !!values.showWatched,
        showStats: !!values.showStats,
      });
      if (result?.error) {
        setError("root", { message: result.error });
        return;
      }
      setSavedMessage("Saved.");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <AvatarUploader
        userId={initial.id}
        currentImage={initial.image}
        name={initial.name}
        username={initial.username}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardContent className="space-y-4">
            <p className="text-base font-medium text-foreground">Appearance</p>
            <ThemeToggle />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <p className="text-base font-medium text-foreground">Details</p>
            <div className="space-y-1.5">
              <Label
                htmlFor="username"
                className="text-xs text-muted-foreground font-normal"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                autoComplete="off"
                spellCheck={false}
                placeholder="your-handle"
                aria-invalid={!!errors.username}
                className="h-10"
                {...register("username", {
                  required: "Pick a username to share your profile.",
                  pattern: {
                    value: USERNAME_RE,
                    message: "3–24 chars, letters/numbers/_/- only.",
                  },
                  onChange: (e) => {
                    const v = e.target.value.toLowerCase();
                    setValue("username", v, { shouldValidate: false });
                  },
                })}
              />
              {errors.username ? (
                <p className="text-destructive text-xs">
                  {errors.username.message}
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  3–24 characters. Letters, numbers, underscore or hyphen. Lowercase.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <p className="text-base font-medium text-foreground">Privacy</p>

            <ToggleRow
              control={control}
              name="isPublic"
              label="Public profile"
              hint={
                isPublic
                  ? "Anyone with your link can see your profile."
                  : "Your profile is hidden. /u/your-handle returns a 404."
              }
            />
            <Separator />
            <ToggleRow
              control={control}
              name="showWatched"
              label="Show watched films"
              hint="When public, show the films you've marked as watched (with your ratings)."
              disabled={!isPublic}
            />
            <Separator />
            <ToggleRow
              control={control}
              name="showStats"
              label="Show stats"
              hint="When public, show your taste profile, charts and top people."
              disabled={!isPublic}
            />
          </CardContent>
        </Card>

        <p className="text-muted-foreground text-xs">
          Public collections always appear on a public profile. Toggle individual
          lists private from the list&apos;s settings.
        </p>

        {errors.root?.message && (
          <p className="text-destructive text-xs">{errors.root.message}</p>
        )}
        {savedMessage && !errors.root && (
          <p className="text-primary text-xs">{savedMessage}</p>
        )}

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isPending} className="h-10">
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Before mount, resolvedTheme is unknown on the server — keep both outline
  // so the first client render matches the server HTML and avoids hydration mismatch.
  const isDark = mounted && resolvedTheme === "dark";
  const isLight = mounted && resolvedTheme === "light";

  return (
    <div className="flex items-start justify-between gap-4">
      <span className="flex flex-col">
        <span className="text-sm font-medium text-foreground">Color scheme</span>
        <span className="text-muted-foreground text-xs mt-0.5">
          Choose how Vcinema looks on your device.
        </span>
      </span>
      <div className="flex gap-1.5 shrink-0">
        <Button
          type="button"
          size="sm"
          variant={isDark ? "default" : "outline"}
          onClick={() => setTheme("dark")}
          className="h-8 px-3 text-xs"
        >
          Dark
        </Button>
        <Button
          type="button"
          size="sm"
          variant={isLight ? "default" : "outline"}
          onClick={() => setTheme("light")}
          className="h-8 px-3 text-xs"
        >
          Light
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({ control, name, label, hint, disabled }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label
          className={`flex items-start justify-between gap-4 cursor-pointer ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{label}</span>
            <span className="text-muted-foreground text-xs mt-0.5">
              {hint}
            </span>
          </span>
          <Switch
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
            aria-label={label}
          />
        </label>
      )}
    />
  );
}
