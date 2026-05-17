'use client';

import { useSearchParams } from "next/navigation";
import SortBy from "@/_components/SortBy";
import SortOrder from "@/_components/SortOrder";
import { TabsOptions } from "@/_components/TabsOptions";

export default function TabBar() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "watched";

  return (
    <>
      <TabsOptions />

      {activeTab !== "history" && (
        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-2 mb-6">
          <SortBy />
          <SortOrder />
        </div>
      )}
    </>
  );
}
