"use client";

import { useNavigation } from "@/_contexts/NavigationContext";
import WatchedMoviesContentLoader from "./WatchedMoviesContentLoader";
import HistorySkeleton from "@/_components/history/HistorySkeleton";

export default function TabContentWrapper({ activeTab, children }) {
  const { isPending, targetTab } = useNavigation();
  if (!isPending) return children;

  // During a client tab switch the URL hasn't committed yet, so trust the
  // destination captured on click; fall back to the committed tab (e.g. a sort
  // change, which doesn't switch tabs).
  const loadingTab = targetTab ?? activeTab;
  return loadingTab === "history" ? (
    <HistorySkeleton />
  ) : (
    <WatchedMoviesContentLoader />
  );
}
