"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/_contexts/NavigationContext";

const navLinks = [
  { href: "/searchMovies", label: "Search" },
  { href: "/watchedMovies", label: "Watched" },
  { href: "/lists", label: "Lists" },
  { href: "/stats", label: "Stats" },
];

export default function NavigationWrapper() {
  const pathname = usePathname();
  const { targetPath, setTargetPath } = useNavigation();

  return (
    <nav className="hidden md:flex items-center gap-1">
      {navLinks.map(({ href, label }) => {
        // While a click is in flight, only the clicked link is active; otherwise
        // fall back to the committed pathname (handles sub-routes, back/forward).
        const active =
          targetPath !== null
            ? targetPath === href
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={(e) => {
              // Let modifier/new-tab clicks navigate without hijacking active state.
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              setTargetPath(href);
            }}
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
