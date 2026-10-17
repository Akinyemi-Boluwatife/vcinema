import { redirect } from "next/navigation";
import { NavigationProvider } from "@/_contexts/NavigationContext";
import { ToastProvider } from "@/_components/ui/Toaster";
import { auth } from "@/_lib/auth";
import Header from "@/_components/layout/Header";
import MobileNav from "@/_components/layout/MobileNav";

export default async function MoviesLayout({ children }) {
  const { user } = await auth();
  if (!user) redirect("/signin");

  return (
    <NavigationProvider>
      <ToastProvider>
      <div className="app-shell">
        <Header />
        <main>{children}</main>
        <MobileNav />
      </div>
      </ToastProvider>
    </NavigationProvider>
  );
}
