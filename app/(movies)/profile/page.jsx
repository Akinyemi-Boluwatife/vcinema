import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getMyProfile } from "@/_lib/profiles";
import ProfileSettingsForm from "@/_components/profile/ProfileSettingsForm";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Profile settings" };

export default async function ProfilePage() {
  const profile = await getMyProfile();
  if (!profile) redirect("/signin");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <header className="mb-8 flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
            Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            How you appear to the rest of Vcinema.
          </p>
        </div>
        {profile.isPublic && profile.username && (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/u/${profile.username}`}>
              View public profile
              <ExternalLink className="size-3.5" />
            </Link>
          </Button>
        )}
      </header>

      <ProfileSettingsForm initial={profile} />
    </div>
  );
}
