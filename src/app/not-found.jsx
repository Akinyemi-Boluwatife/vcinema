"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-8xl font-bold text-primary-container">404</h1>
      <div className="h-1 w-16 rounded-full bg-primary-container my-5" />
      <p className="text-2xl font-bold text-on-surface">Page Not Found</p>
      <p className="text-sm mt-3 text-on-surface-variant max-w-sm">
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>
      <Link
        href="/searchMovies"
        className="mt-8 px-6 py-2.5 bg-primary-container text-on-primary-container text-sm font-semibold rounded no-underline hover:bg-primary-dim transition-colors duration-200"
      >
        Go to Search
      </Link>
    </div>
  );
}
