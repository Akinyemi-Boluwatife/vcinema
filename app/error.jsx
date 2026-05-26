"use client";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-4 bg-background">
      <p
        className="font-display text-foreground"
        style={{ fontSize: "clamp(56px, 10vw, 96px)", lineHeight: 1 }}
      >
        Something broke.
      </p>
      <p className="text-base text-muted-foreground max-w-md">
        {error?.message ?? "Try again, or head back to search."}
      </p>
      <div className="flex gap-3 mt-2">
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
