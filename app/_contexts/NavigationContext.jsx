"use client";

import {
  createContext,
  use,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname } from "next/navigation";

const NavigationContext = createContext({
  isPending: false,
  startNavigation: (fn) => fn(),
  targetTab: null,
  setTargetTab: () => {},
  targetPath: null,
  setTargetPath: () => {},
});

export function NavigationProvider({ children }) {
  const [isPending, startTransition] = useTransition();
  // The tab a client navigation is heading to. Set synchronously (urgently)
  // on click so a pending loader can show the destination's skeleton — the URL
  // itself doesn't update until the transition commits.
  const [targetTab, setTargetTab] = useState(null);
  // The path a nav link is heading to, set on click so the active/underline
  // styling moves instantly instead of waiting for the navigation to commit.
  const [targetPath, setTargetPath] = useState(null);

  // Once the route actually commits to the target (or changes via back/forward),
  // drop the optimistic path so active styling falls back to the real pathname.
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  if (lastPath.current !== pathname) {
    lastPath.current = pathname;
    if (targetPath !== null) setTargetPath(null);
  }

  const value = useMemo(
    () => ({
      isPending,
      startNavigation: startTransition,
      targetTab,
      setTargetTab,
      targetPath,
      setTargetPath,
    }),
    [isPending, startTransition, targetTab, targetPath],
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return use(NavigationContext);
}
