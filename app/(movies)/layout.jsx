import { redirect } from "next/navigation";
import BottomNav from "@/_components/layout/BottomNav";
import { NavigationProvider } from "@/_contexts/NavigationContext";
import { getAuthContext } from "@/_lib/auth";
import Header from "@/_components/layout/Header";

export default async function MoviesLayout({ children }) {
  const { user } = await getAuthContext();
  if (!user) redirect("/signin");

  return (
    <NavigationProvider>
      <Header />
      <main className="pb-24 md:pb-0">{children}</main>
      <BottomNav />
    </NavigationProvider>
  );
}
