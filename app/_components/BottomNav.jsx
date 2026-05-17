"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiMagnifyingGlass,
  HiFilm,
  HiChartBar,
  HiQueueList,
} from "react-icons/hi2";

const navLinks = [
  { href: "/searchMovies", label: "Search", Icon: HiMagnifyingGlass },
  { href: "/watchedMovies", label: "Watched", Icon: HiFilm },
  { href: "/lists", label: "Lists", Icon: HiQueueList },
  { href: "/stats", label: "Stats", Icon: HiChartBar },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-xs">
      <div
        className="flex rounded-2xl overflow-hidden border border-white/10"
        style={{
          background: "rgba(29, 27, 28, 0.55)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.45), 0 1.5px 0 rgba(255,255,255,0.07) inset",
        }}
      >
        {navLinks.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 no-underline transition-all duration-200 text-[9px] font-semibold uppercase tracking-widest relative ${
                active
                  ? "text-primary-container"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {active && (
                <span className="absolute inset-x-2 inset-y-1 rounded-xl bg-primary-container/10" />
              )}
              <Icon className="text-[1.1rem] relative z-10" />
              <span className="relative z-10">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
