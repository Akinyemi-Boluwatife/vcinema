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

export default function SortOrder() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startNavigation } = useNavigation();
  const sortOrder = searchParams.get("sortOrder") || "desc";

  function handleSortOrder(order) {
    const params = new URLSearchParams(searchParams);
    params.set("sortOrder", order);
    params.delete("page");
    startNavigation(() =>
      router.replace(`${pathname}?${params.toString()}`, { scroll: false }),
    );
  }

  return (
    <Select value={sortOrder} onValueChange={handleSortOrder}>
      <SelectTrigger className="w-full sm:w-[150px] h-9">
        <span className="text-xs text-muted-foreground">Order</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="desc">Newest first</SelectItem>
        <SelectItem value="asc">Oldest first</SelectItem>
      </SelectContent>
    </Select>
  );
}
