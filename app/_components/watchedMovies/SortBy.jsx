"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useNavigation } from "@/_contexts/NavigationContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPTIONS = [
  { value: "imdb_rating", label: "IMDB Rating" },
  { value: "year", label: "Year" },
  { value: "runtime", label: "Runtime" },
  { value: "user_rating", label: "Your rating" },
];

export default function SortBy() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startNavigation } = useNavigation();
  const sortBy = searchParams.get("sortBy") || "imdb_rating";

  function handleSort(sort) {
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", sort);
    params.delete("page");
    startNavigation(() =>
      router.replace(`${pathname}?${params.toString()}`, { scroll: false }),
    );
  }

  return (
    <Select value={sortBy} onValueChange={handleSort}>
      <SelectTrigger className="w-full sm:w-[180px] h-9">
        <span className="text-xs text-muted-foreground">Sort by</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
