"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/searchMovies", label: "Search" },
  { href: "/watchedMovies", label: "Watchlist" },
  { href: "/stats", label: "Stats" },
];

function NavigationWrapper() {
  const pathname = usePathname();
  return (
    <div className="hidden sm:flex items-center gap-1">
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-3 py-1.5 rounded text-sm font-medium no-underline transition-colors duration-200 ${
            pathname === href
              ? "bg-primary-container text-on-primary-container"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-high"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

export default NavigationWrapper;
