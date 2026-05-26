import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Film } from "lucide-react";
import {
  getPublicProfileByUsername,
  getPublicWatched,
  getPublicCollections,
} from "@/_lib/profiles";
import { aggregateStats } from "@/_lib/stats";
import { createServerSupabase } from "@/_lib/supabase";
import Logo from "@/_components/layout/Logo";
import MovieCard from "@/_components/ui/MovieCard";
import KpiRow from "@/_components/stats/KpiRow";
import Pagination from "@/_components/shared/Pagination";
import ViewerCta from "@/_components/profile/ViewerCta";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PER_PAGE = 10;

export async function generateMetadata({ params }) {
  const { username } = await params;
  const profile = await getPublicProfileByUsername(username);
  if (!profile) return { title: "Profile not found" };
  const name = profile.name ?? profile.username;
  const title = `${name} on Vcinema`;
  const description = `${name}'s watched films, ratings, and public lists on Vcinema.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `/u/${profile.username}`,
      images: profile.image ? [{ url: profile.image }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: profile.image ? [profile.image] : undefined,
    },
  };
}

export default async function PublicProfilePage({ params, searchParams }) {
  const { username } = await params;
  const sp = (await searchParams) ?? {};
  const profile = await getPublicProfileByUsername(username);
  if (!profile) notFound();

  const supabase = await createServerSupabase();
  const {
    data: { user: viewer },
  } = await supabase.auth.getUser();
  const isOwnProfile = viewer?.id === profile.id;
  const nextHref = `/u/${profile.username}`;
  const signinHref = `/signin?next=${encodeURIComponent(nextHref)}`;

  const wp = parsePage(sp.wp);
  const lp = parsePage(sp.lp);

  const [watched, collections] = await Promise.all([
    getPublicWatched(profile.username),
    getPublicCollections(profile.username),
  ]);

  const stats =
    profile.showStats && watched.length ? await aggregateStats(watched) : null;

  const watchedPage = paginate(watched, wp, PER_PAGE);
  const listsPage = paginate(collections, lp, PER_PAGE);

  const hasAnySection =
    !!stats || (profile.showWatched && watched.length) || collections.length > 0;

  const joined = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <Logo size={22} />
          <ViewerCta
            viewer={viewer}
            isOwnProfile={isOwnProfile}
            next={nextHref}
          />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col gap-12">
        <ProfileHeader
          name={profile.name}
          username={profile.username}
          image={profile.image}
          joined={joined}
        />

        {stats && (
          <Section title="Stats">
            <KpiRow kpis={stats.kpis} />
          </Section>
        )}

        {profile.showWatched && watched.length > 0 && (
          <Section
            title="Watched"
            subtitle={`${watched.length} ${watched.length === 1 ? "film" : "films"}`}
          >
            <div className="flex flex-col gap-3">
              {watchedPage.map((m) => (
                <MovieCard key={m.imdbID} movie={m} variant="watched" />
              ))}
            </div>
            <Suspense>
              <Pagination
                paramName="wp"
                total={watched.length}
                perPage={PER_PAGE}
              />
            </Suspense>
          </Section>
        )}

        {collections.length > 0 && (
          <Section
            title="Public lists"
            subtitle={`${collections.length} ${collections.length === 1 ? "list" : "lists"}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listsPage.map((c) => (
                <PublicCollectionLink key={c.id} collection={c} />
              ))}
            </div>
            <Suspense>
              <Pagination
                paramName="lp"
                total={collections.length}
                perPage={PER_PAGE}
              />
            </Suspense>
          </Section>
        )}

        {!hasAnySection && (
          <div className="flex flex-col items-center text-center py-12">
            <Film
              className="size-8 text-muted-foreground mb-4"
              aria-hidden
            />
            <p className="text-base font-medium text-foreground mb-1">
              Nothing to show here yet.
            </p>
          </div>
        )}

        {!viewer && (
          <Card>
            <CardContent className="flex items-center justify-between gap-6 flex-wrap py-2">
              <div className="flex-1 min-w-[260px]">
                <p
                  className="font-display text-foreground"
                  style={{ fontSize: 24, lineHeight: 1.1 }}
                >
                  Track your own films, ratings, and lists.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Vcinema is a private journal. Start your own in 30 seconds.
                </p>
              </div>
              <Button asChild>
                <Link href={signinHref}>Get started</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function parsePage(raw) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

function paginate(list, page, perPage) {
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const safe = Math.min(Math.max(1, page), totalPages);
  const start = (safe - 1) * perPage;
  return list.slice(start, start + perPage);
}

function ProfileHeader({ name, username, image, joined }) {
  const displayName = name ?? username ?? "?";
  const initials = displayName.slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <Avatar className="size-20">
        {image ? <AvatarImage src={image} alt={displayName} /> : null}
        <AvatarFallback className="text-2xl font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <h1
          className="font-display text-foreground"
          style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.05,
          }}
        >
          {name ?? username}
        </h1>
        <p className="text-muted-foreground text-sm font-mono mt-1">
          @{username}
        </p>
        {joined && (
          <p className="text-muted-foreground text-xs mt-1">Joined {joined}</p>
        )}
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-xs mt-1">{subtitle}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function PublicCollectionLink({ collection }) {
  const { title, description, itemCount, coverPoster, publicSlug } = collection;
  return (
    <Link href={`/c/${publicSlug}`} className="no-underline">
      <Card className="overflow-hidden hover:border-primary transition-colors h-full p-0">
        <div className="h-24 bg-muted">
          {coverPoster ? (
            <img
              src={coverPoster}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: "saturate(0.85)" }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Film className="size-6" aria-hidden />
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-foreground text-sm font-medium truncate">
            {title}
          </p>
          {description && (
            <p className="text-muted-foreground text-xs line-clamp-2 mt-1">
              {description}
            </p>
          )}
          <p className="text-muted-foreground text-xs mt-2">
            {itemCount} {itemCount === 1 ? "film" : "films"}
          </p>
        </div>
      </Card>
    </Link>
  );
}
