"use client";

import { useSearchParams } from "next/navigation";
import SortBy from "@/_components/watchedMovies/SortBy";
import SortOrder from "@/_components/watchedMovies/SortOrder";
import { TabsOptions } from "@/_components/watchedMovies/TabsOptions";

export default function TabBar() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "watched";

  return (
    <>
      <TabsOptions />

      {activeTab !== "history" && (
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mb-6">
          <SortBy />
          <SortOrder />
        </div>
      )}
    </>
  );
}
