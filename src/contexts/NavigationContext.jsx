"use client";

import { createContext, useContext, useTransition } from "react";

const NavigationContext = createContext({
  isPending: false,
  startNavigation: (fn) => fn(),
});

export function NavigationProvider({ children }) {
  const [isPending, startTransition] = useTransition();

  return (
    <NavigationContext.Provider
      value={{ isPending, startNavigation: startTransition }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined)
    throw new Error("UseNavigation was called outside context");

  return context;
}
