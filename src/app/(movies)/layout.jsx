import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import BottomNav from "@/components/BottomNav";
import { NavigationProvider } from "@/contexts/NavigationContext";

export default function MoviesLayout({ children }) {
  return (
    <NavigationProvider>
      <Suspense fallback={null}>
        <NavBar />
      </Suspense>
      <main className="pb-16 sm:pb-0">{children}</main>
      <BottomNav />
    </NavigationProvider>
  );
}
