import Link from "next/link";
import { auth } from "@/_lib/auth";
import Logo from "@/_components/layout/Logo";
import { Button } from "@/components/ui/button";

export async function HomePage() {
  const { user } = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex items-center justify-between px-6 sm:px-8 py-6">
        <Logo size={26} />
        <div className="flex items-center gap-2">
          {!user &&
            <>
              <Button asChild variant="ghost" size="lg" className="h-10">
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button asChild size="lg" className="h-10">
                <Link href="/signin">Get started</Link>
              </Button>
            </>
          }
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <h1
          className="text-display max-w-[14ch] mb-7 text-foreground"
          style={{ fontSize: "clamp(48px, 8vw, 104px)", lineHeight: 1.05, textWrap: "balance" }}
        >
          Watch. Rate. Remember.
        </h1>
        <p
          className="text-muted-foreground max-w-md mb-10 leading-relaxed"
          style={{ fontSize: 17, textWrap: "pretty" }}
        >
          A private journal for the films you&apos;ve seen. No social feed. No
          recommendations. Just your taste, over time.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="h-11 px-5 text-sm">
            <Link href={user ? "/searchMovies" : "/signin"}>
              {user ? "Go to app" : "Get started"}
            </Link>
          </Button>
          {!user && (
            <Button asChild variant="outline" size="lg" className="h-11 px-5 text-sm">
              <Link href="/signin">Sign in</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
