"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Telescope, Film, LayoutList, PieChart, UserRound } from "lucide-react";
import { useNavigation } from "@/_contexts/NavigationContext";
import { tabBarItem } from "@/_styles/classes";

const navLinks = [
  { href: "/searchMovies", label: "Search", Icon: Telescope },
  { href: "/watchedMovies", label: "Watched", Icon: Film },
  { href: "/lists", label: "Lists", Icon: LayoutList },
  { href: "/stats", label: "Stats", Icon: PieChart },
  { href: "/profile", label: "Profile", Icon: UserRound },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { targetPath, setTargetPath } = useNavigation();

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex">
        {navLinks.map(({ href, label, Icon }) => {
          const active =
            targetPath !== null
              ? targetPath === href
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                  setTargetPath(href);
                }}
                className={`${tabBarItem.base} ${active ? tabBarItem.active : tabBarItem.inactive}`}
              >
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
