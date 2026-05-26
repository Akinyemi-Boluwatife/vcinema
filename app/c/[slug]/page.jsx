import { notFound } from "next/navigation";
import Link from "next/link";
import { Globe } from "lucide-react";
import { getPublicCollectionBySlug } from "@/_lib/collections";
import { createServerSupabase } from "@/_lib/supabase";
import Logo from "@/_components/layout/Logo";
import ViewerCta from "@/_components/profile/ViewerCta";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collection = await getPublicCollectionBySlug(slug);
  if (!collection) return { title: "Shared collection" };
  const title = collection.title;
  const description =
    collection.description ||
    `A list of ${collection.items.length} ${
      collection.items.length === 1 ? "film" : "films"
    } on Vcinema.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `/c/${slug}`,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PublicCollectionPage({ params }) {
  const { slug } = await params;
  const collection = await getPublicCollectionBySlug(slug);
  if (!collection) notFound();

  const supabase = await createServerSupabase();
  const {
    data: { user: viewer },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <Logo size={22} />
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Shared list
            </span>
            <ViewerCta viewer={viewer} next={`/c/${slug}`} />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h1
          className="font-display text-foreground"
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.1,
          }}
        >
          {collection.title}
        </h1>
        {collection.description && (
          <p
            className="text-muted-foreground mt-4 max-w-prose"
            style={{ fontSize: 17, lineHeight: 1.55 }}
          >
            {collection.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-5">
          <Badge variant="outline" className="text-xs">
            {collection.items.length}{" "}
            {collection.items.length === 1 ? "film" : "films"}
          </Badge>
          <Badge variant="outline" className="text-xs uppercase tracking-wider">
            <Globe className="size-2.5" /> Public
          </Badge>
        </div>

        {collection.items.length === 0 ? (
          <div className="flex flex-col items-center text-center py-20 px-4 mt-12">
            <p className="text-base font-medium text-foreground mb-1">
              This list is empty.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-12">
            {collection.items.map((item) => (
              <Link
                key={item.imdbID}
                href={`/movieDetails/${item.imdbID}`}
                className="no-underline group"
              >
                <div className="poster">
                  {item.poster && item.poster !== "N/A" ? (
                    <img src={item.poster} alt={item.title} loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-sm text-foreground leading-tight line-clamp-2">
                    {item.title}
                  </p>
                  {item.year && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.year}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {!viewer && (
          <Card className="mt-16">
            <CardContent className="flex items-center justify-between gap-6 flex-wrap py-2">
              <div className="flex-1 min-w-[260px]">
                <p
                  className="font-display text-foreground"
                  style={{ fontSize: 28, lineHeight: 1.1 }}
                >
                  Sign in to track your own.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vcinema is a private journal for the films you&apos;ve seen.
                  Start your own list in 30 seconds.
                </p>
              </div>
              <ViewerCta viewer={null} next={`/c/${slug}`} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
