"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useNavigation } from "@/_contexts/NavigationContext";

const TABS = [
  { key: "watched", label: "Watched" },
  { key: "want_to_watch", label: "Want to Watch" },
  { key: "dropped", label: "Dropped" },
];

export default function TabBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startNavigation } = useNavigation();
  const active = searchParams.get("tab") ?? "watched";

  function handleSelect(key) {
    if (key === active) return;
    startNavigation(() => router.push(`/watchedMovies?tab=${key}`));
  }

  return (
    <div className="flex gap-1 p-1 bg-surface-high rounded-xl border border-outline-variant/30 mb-6">
      {TABS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleSelect(key)}
            aria-pressed={isActive}
            className={`flex-1 text-center text-xs font-semibold py-2 px-2 rounded-lg transition-all duration-200 cursor-pointer border-none ${
              isActive
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
