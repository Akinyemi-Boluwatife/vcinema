"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog as DialogPrimitive } from "radix-ui";
import {
  Menu,
  X,
  Telescope,
  Film,
  LayoutList,
  PieChart,
  UserRound,
} from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { href: "/searchMovies", label: "Search", Icon: Telescope },
  { href: "/watchedMovies", label: "Watched", Icon: Film },
  { href: "/lists", label: "Lists", Icon: LayoutList },
  { href: "/stats", label: "Stats", Icon: PieChart },
  { href: "/profile", label: "Profile", Icon: UserRound },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        aria-label="Open menu"
        className="md:hidden inline-flex items-center justify-center size-9 -ml-1 rounded-md text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Menu size={22} strokeWidth={1.75} aria-hidden />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="md:hidden fixed inset-0 z-50 bg-black/40 supports-backdrop-filter:backdrop-blur-xs duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="md:hidden fixed inset-y-0 left-0 z-50 h-full w-72 max-w-[80%] bg-background border-r border-border shadow-2xl outline-none flex flex-col duration-200 data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left"
        >
          <DialogPrimitive.Title className="sr-only">
            Navigation
          </DialogPrimitive.Title>

          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <Logo size={22} />
            <DialogPrimitive.Close
              aria-label="Close menu"
              className="inline-flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <X size={20} strokeWidth={1.75} aria-hidden />
            </DialogPrimitive.Close>
          </div>

          <nav aria-label="Primary" className="flex flex-col gap-1 p-3">
            {navLinks.map(({ href, label, Icon }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <DialogPrimitive.Close asChild key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 no-underline rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon
                      size={19}
                      strokeWidth={active ? 2.25 : 1.75}
                      aria-hidden
                    />
                    {label}
                  </Link>
                </DialogPrimitive.Close>
              );
            })}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
