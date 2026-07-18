import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicProfileByUsername } from "@/_lib/profiles";
import { createServerSupabase } from "@/_lib/supabase";
import Logo from "@/_components/layout/Logo";
import ViewerCta from "@/_components/profile/ViewerCta";
import PublicStatsSection from "@/_components/profile/PublicStatsSection";
import PublicStatsSectionSkeleton from "@/_components/profile/PublicStatsSectionSkeleton";
import PublicWatchedSection from "@/_components/profile/PublicWatchedSection";
import PublicWatchedSectionSkeleton from "@/_components/profile/PublicWatchedSectionSkeleton";
import PublicListsSection from "@/_components/profile/PublicListsSection";
import PublicListsSectionSkeleton from "@/_components/profile/PublicListsSectionSkeleton";
import PublicProfileEmptyState from "@/_components/profile/PublicProfileEmptyState";
import { parsePage } from "@/_components/profile/publicProfileUtils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

        <Suspense fallback={<PublicStatsSectionSkeleton />}>
          <PublicStatsSection
            username={profile.username}
            showStats={profile.showStats}
          />
        </Suspense>

        <Suspense fallback={<PublicWatchedSectionSkeleton />}>
          <PublicWatchedSection username={profile.username} page={wp} />
        </Suspense>

        <Suspense fallback={<PublicListsSectionSkeleton />}>
          <PublicListsSection username={profile.username} page={lp} />
        </Suspense>

        <Suspense fallback={null}>
          <PublicProfileEmptyState username={profile.username} />
        </Suspense>

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
