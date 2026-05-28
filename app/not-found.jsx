import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-background">
      <p
        className="font-display text-foreground mb-6"
        style={{
          fontSize: "clamp(120px, 22vw, 240px)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        404
      </p>
      <p className="text-xl md:text-2xl font-semibold text-foreground mb-2">
        This page didn&apos;t make the cut.
      </p>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        The film, list, or page you&apos;re looking for doesn&apos;t exist, or it&apos;s
        been pulled from the reel.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Button asChild>
          <Link href="/searchMovies">
            <Search className="size-4" />
            Find a film
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  );
}
