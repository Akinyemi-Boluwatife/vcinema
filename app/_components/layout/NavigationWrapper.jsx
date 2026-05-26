"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/searchMovies", label: "Search" },
  { href: "/watchedMovies", label: "Watched" },
  { href: "/lists", label: "Lists" },
  { href: "/stats", label: "Stats" },
];

export default function NavigationWrapper() {
  const pathname = usePathname();
  return (
    <nav className="hidden md:flex items-center gap-1">
      {navLinks.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`relative px-3.5 py-2 rounded-md text-sm font-medium no-underline transition-colors ${
              active
                ? "text-foreground nav-underline-active"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
