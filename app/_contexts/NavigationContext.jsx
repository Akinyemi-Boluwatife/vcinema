"use client";

import { createContext, use, useMemo, useTransition } from "react";

const NavigationContext = createContext({
  isPending: false,
  startNavigation: (fn) => fn(),
});

export function NavigationProvider({ children }) {
  const [isPending, startTransition] = useTransition();
  const value = useMemo(
    () => ({ isPending, startNavigation: startTransition }),
    [isPending, startTransition],
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
