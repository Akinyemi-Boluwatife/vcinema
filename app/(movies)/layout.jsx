import { redirect } from "next/navigation";
import BottomNav from "@/_components/BottomNav";
import { NavigationProvider } from "@/_contexts/NavigationContext";
import { createServerSupabase } from "@/_lib/supabase";
import Header from "../_components/Header";

export default async function MoviesLayout({ children }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  return (
    <NavigationProvider>
      <Header />
      <main className="pb-16 sm:pb-0">{children}</main>
      <BottomNav />
    </NavigationProvider>
  );
}
