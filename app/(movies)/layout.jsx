import { redirect } from "next/navigation";
import BottomNav from "@/_components/BottomNav";
import { NavigationProvider } from "@/_contexts/NavigationContext";
import { auth } from "../../auth";
import Header from "../_components/Header";

export default async function MoviesLayout({ children }) {
  const session = await auth().catch(() => null);
  if (!session?.user) redirect("/signin");

  return (
    <NavigationProvider>
      <Header />

      <main className="pb-16 sm:pb-0">{children}</main>
      <BottomNav />
    </NavigationProvider>
  );
}
