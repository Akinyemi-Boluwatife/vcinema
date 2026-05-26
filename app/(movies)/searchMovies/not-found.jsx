import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 gap-4">
      <Search className="size-8 text-muted-foreground" aria-hidden />
      <p className="text-xl md:text-2xl font-semibold text-foreground">
        This page could not be found.
      </p>
      <Button asChild>
        <Link href="/searchMovies">Back to search</Link>
      </Button>
    </main>
  );
}
