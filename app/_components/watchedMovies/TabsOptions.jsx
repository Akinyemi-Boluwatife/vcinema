"use client";

import { Suspense, useOptimistic } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useNavigation } from "@/_contexts/NavigationContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { key: "watched", label: "Watched" },
  { key: "want_to_watch", label: "Want to watch" },
  { key: "dropped", label: "Dropped" },
  { key: "history", label: "History" },
];

function TabsOptionsInner() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const get = searchParams.get.bind(searchParams);
  const { startNavigation, setTargetTab } = useNavigation();
  const active = get("tab") ?? "watched";
  // Optimistically move the active underline the instant a tab is clicked,
  // instead of waiting for the navigation + data fetch to resolve the URL.
  const [optimisticTab, setOptimisticTab] = useOptimistic(active);

  function handleSelect(key) {
    if (key === optimisticTab) return;
    // Urgent (outside the transition) so the content loader can immediately
    // render the destination tab's skeleton while the data streams in.
    setTargetTab(key);
    const params = new URLSearchParams(searchParams);
    params.set("tab", key);
    params.delete("page");
    startNavigation(() => {
      setOptimisticTab(key);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <Tabs value={optimisticTab} onValueChange={handleSelect} className="mb-8">
      <TabsList className="w-full sm:w-fit justify-stretch gap-0.5 bg-muted rounded-[10px] p-0.5 h-9 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map(({ key, label }) => (
          <TabsTrigger
            key={key}
            value={key}
            className="rounded-lg border-0 px-3 sm:px-4 text-[13px] font-medium text-muted-foreground hover:text-foreground whitespace-nowrap after:hidden transition-colors data-[state=active]:bg-accent data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:data-[state=active]:bg-accent dark:data-[state=active]:text-foreground dark:data-[state=active]:border-0"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export function TabsOptions() {
  return <Suspense fallback={null}><TabsOptionsInner /></Suspense>;
}
