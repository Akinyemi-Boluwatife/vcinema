"use client";

import { useNavigation } from "@/_contexts/NavigationContext";
import WatchedMoviesContentLoader from "./WatchedMoviesContentLoader";

export default function TabContentWrapper({ children }) {
  const { isPending } = useNavigation();
  return isPending ? <WatchedMoviesContentLoader /> : children;
}
