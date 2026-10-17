import { Suspense } from "react";
import Link from "next/link";
import Logo from "./Logo";
import SignOutButton from "./SignOutButton";
import SearchInputWrapper from "@/_components/searchMovies/SearchInputWrapper";
import NavigationWrapper from "./NavigationWrapper";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getMyProfile } from "@/_lib/profiles";

function initialsFrom(profile) {
  const source = profile?.username || profile?.name || "";
  return source.slice(0, 2).toUpperCase() || "ME";
}

export default async function Header() {
  const profile = await getMyProfile();

  return (
    <header className="sticky top-0 z-50 h-14 md:h-14 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="h-full max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-4 lg:gap-8">
          <Logo size={22} />
          <NavigationWrapper />
        </div>
        <div className="flex-1 hidden md:flex justify-center px-2">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <Suspense>
              <SearchInputWrapper />
            </Suspense>
          </div>
        </div>
        <div className="flex items-center gap-1.5 ml-auto md:ml-0">
          <Link
            href="/profile"
            aria-label="Profile settings"
            className="no-underline rounded-full"
          >
            <Avatar className="size-8 cursor-pointer">
              {profile?.image && (
                <AvatarImage src={profile.image} alt="" />
              )}
              <AvatarFallback className="text-xs font-medium">
                {initialsFrom(profile)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
