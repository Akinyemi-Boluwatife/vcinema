'use client';

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useNavigation } from "@/_contexts/NavigationContext";
import { HiChevronDown } from "react-icons/hi2";

export default function SortBy() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { startNavigation } = useNavigation();
    const sortBy = searchParams.get("sortBy") || "imdb_rating";

    function handleSort(sort) {
        const params = new URLSearchParams(searchParams);
        params.set("sortBy", sort);
        startNavigation(() =>
            router.replace(`${pathname}?${params.toString()}`, { scroll: false }),
        );
    }

    return (
        <div className="relative w-full sm:w-auto">
            <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="w-full sm:w-auto sm:min-w-[140px] appearance-none bg-surface-high border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-outline-variant/60 rounded-lg text-xs font-semibold py-2 px-3 pr-9 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all duration-200 cursor-pointer"
            >
                <option value="imdb_rating" className="bg-surface-high text-on-surface">IMDB Rating</option>
                <option value="year" className="bg-surface-high text-on-surface">Year</option>
                <option value="runtime" className="bg-surface-high text-on-surface">Runtime</option>
                <option value="user_rating" className="bg-surface-high text-on-surface">Your rating</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-on-surface-variant/60">
                <HiChevronDown size={14} />
            </div>
        </div>
    );
}   