import Link from "next/link";
import { Lock } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center">
      <Lock className="size-12 text-muted-foreground" />
      <h1 className="text-on-surface text-xl font-semibold">List not found</h1>
      <p className="text-on-surface-variant text-sm">
        This collection is private or no longer exists.
      </p>
      <Link
        href="/"
        className="text-primary text-sm no-underline mt-2"
      >
        Go home
      </Link>
    </div>
  );
}
