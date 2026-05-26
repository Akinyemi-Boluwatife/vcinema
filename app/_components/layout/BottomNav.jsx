"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Telescope, Film, LayoutList, PieChart, UserRound } from "lucide-react";

const navLinks = [
  { href: "/searchMovies",  label: "Search",  Icon: Telescope  },
  { href: "/watchedMovies", label: "Watched",  Icon: Film       },
  { href: "/lists",         label: "Lists",    Icon: LayoutList },
  { href: "/stats",         label: "Stats",    Icon: PieChart   },
  { href: "/profile",       label: "Profile",  Icon: UserRound  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed left-4 right-4 bottom-5 z-50 h-14 rounded-full border border-border/70 bg-background/90 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.15)] flex items-center justify-between px-3"
    >
      {navLinks.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-1.5 no-underline rounded-full transition-all duration-300 ease-out ${
              active
                ? "border border-primary text-primary px-3 py-1.5"
                : "text-muted-foreground/50 hover:text-muted-foreground px-2 py-1.5"
            }`}
          >
            <Icon
              size={18}
              strokeWidth={active ? 2.5 : 1.75}
              aria-hidden
            />
            {active && (
              <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
                {label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
