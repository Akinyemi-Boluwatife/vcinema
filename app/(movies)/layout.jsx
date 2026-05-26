import { redirect } from "next/navigation";
import BottomNav from "@/_components/layout/BottomNav";
import { NavigationProvider } from "@/_contexts/NavigationContext";
import { createServerSupabase } from "@/_lib/supabase";
import Header from "@/_components/layout/Header";

export default async function MoviesLayout({ children }) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  return (
    <NavigationProvider>
      <Header />
      <main className="pb-24 md:pb-0">{children}</main>
      <BottomNav />
    </NavigationProvider>
  );
}
