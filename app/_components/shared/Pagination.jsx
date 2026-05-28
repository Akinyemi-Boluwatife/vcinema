"use client";

import { Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaginationInner({
  paramName = "page",
  total,
  perPage = 10,
}) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = searchParams.get.bind(searchParams);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const raw = Number(get(paramName));
  const page = Number.isInteger(raw) && raw >= 1 && raw <= totalPages ? raw : 1;

  if (totalPages <= 1) return null;

  function go(next) {
    const params = new URLSearchParams(searchParams);
    if (next <= 1) params.delete(paramName);
    else params.set(paramName, String(next));
    const qs = params.toString();
    replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  const start = (page - 1) * perPage + 1;
  const end = Math.min(total, page * perPage);

  return (
    <nav
      className="flex items-center justify-between gap-3 mt-6"
      aria-label="Pagination"
    >
      <span className="text-muted-foreground text-xs font-mono">
        {start}–{end} of {total}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-foreground text-xs font-medium tabular-nums">
          {page} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}

export default function Pagination(props) {
  return <Suspense fallback={null}><PaginationInner {...props} /></Suspense>;
}
