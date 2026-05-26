"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useNavigation } from "@/_contexts/NavigationContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { key: "watched", label: "Watched" },
  { key: "want_to_watch", label: "Want to watch" },
  { key: "dropped", label: "Dropped" },
  { key: "history", label: "History" },
];

export function TabsOptions() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startNavigation } = useNavigation();
  const active = searchParams.get("tab") ?? "watched";

  function handleSelect(key) {
    if (key === active) return;
    const params = new URLSearchParams(searchParams);
    params.set("tab", key);
    params.delete("page");
    startNavigation(() =>
      router.replace(`${pathname}?${params.toString()}`, { scroll: false }),
    );
  }

  return (
    <Tabs value={active} onValueChange={handleSelect} className="mb-6">
      <TabsList className="w-full justify-start gap-0 bg-transparent border-b border-border rounded-none p-0 h-auto overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map(({ key, label }) => (
          <TabsTrigger
            key={key}
            value={key}
            className="rounded-none border-t-0 border-x-0 border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:!bg-transparent data-[state=active]:shadow-none data-[state=active]:text-foreground dark:data-[state=active]:!bg-transparent dark:data-[state=active]:border-b-primary text-muted-foreground hover:text-foreground py-2.5 px-2.5 sm:px-4 text-xs sm:text-sm font-medium -mb-px whitespace-nowrap"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
