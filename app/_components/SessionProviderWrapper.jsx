"use client";

import { SessionProvider } from "next-auth/react";

//If the component responds to user interaction and needs to know auth state in the moment — that's when to use useSession().
export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
