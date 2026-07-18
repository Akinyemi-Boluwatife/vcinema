import { redirect } from "next/navigation";
import { NavigationProvider } from "@/_contexts/NavigationContext";
import { auth } from "@/_lib/auth";
import Header from "@/_components/layout/Header";

export default async function MoviesLayout({ children }) {
  const { user } = await auth();
  if (!user) redirect("/signin");

  return (
    <NavigationProvider>
      <Header />
      <main>{children}</main>
    </NavigationProvider>
  );
}
