"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Logo from "./Logo";
import Search from "./Search";
import { useNavigation } from "@/contexts/NavigationContext";

const navLinks = [
  { href: "/searchMovies", label: "Search" },
  { href: "/watchedMovies", label: "Watchlist" },
];

export default function NavBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const { startNavigation } = useNavigation();
  const debounceRef = useRef(null);

  function handleQueryChange(nextQuery) {
    setQuery(nextQuery);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (nextQuery.length >= 3) {
        startNavigation(() =>
          router.push(`/searchMovies?q=${encodeURIComponent(nextQuery)}`),
        );
      } else if (nextQuery.length === 0 && pathname === "/searchMovies") {
        startNavigation(() => router.push("/searchMovies"));
      }
    }, 500);
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface-low/80 backdrop-blur-md border-b border-outline-variant/30">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <Logo />
        <div className="flex-1">
          <Search query={query} setQuery={handleQueryChange} />
        </div>
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
      </div>
    </nav>
  );
}
