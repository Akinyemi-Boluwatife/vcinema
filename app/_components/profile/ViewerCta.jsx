import Link from "next/link";
import { Button } from "@/components/ui/button";

function signinHref(next) {
  return next ? `/signin?next=${encodeURIComponent(next)}` : "/signin";
}

export default function ViewerCta({ viewer, isOwnProfile = false, next }) {
  if (isOwnProfile) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/profile">Edit profile</Link>
      </Button>
    );
  }
  if (viewer) return null;
  const href = signinHref(next);
  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm">
        <Link href={href}>Sign in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href={href}>Get started</Link>
      </Button>
    </div>
  );
}
