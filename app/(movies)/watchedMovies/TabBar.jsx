"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SortBy from "@/_components/watchedMovies/SortBy";
import SortOrder from "@/_components/watchedMovies/SortOrder";
import { TabsOptions } from "@/_components/watchedMovies/TabsOptions";

function TabBarInner() {
  const searchParams = useSearchParams();
  const get = searchParams.get.bind(searchParams);
  const activeTab = get("tab") ?? "watched";

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

export default function TabBar() {
  return <Suspense fallback={null}><TabBarInner /></Suspense>;
}
