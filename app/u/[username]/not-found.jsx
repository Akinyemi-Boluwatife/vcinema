import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Profile not found" };

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="max-w-sm w-full flex flex-col items-center text-center gap-4">
        <p
          className="font-display text-foreground"
          style={{ fontSize: "clamp(72px, 16vw, 140px)", lineHeight: 1 }}
        >
          404
        </p>
        <p className="text-xl font-medium text-foreground">
          Profile not found
        </p>
        <p className="text-sm text-muted-foreground">
          This profile doesn&apos;t exist or is private.
        </p>
        <Button asChild className="mt-2">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}
