import "./globals.css";
import { auth } from "../auth";
import SessionProviderWrapper from "@/_components/SessionProviderWrapper";
import Header from "./_components/Header";

export const metadata = {
  title: {
    template: "%s / Vcinema ",
    default: "Welcome / Vcinema!",
  },
  description: "Movie discovery and watched list",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <main>{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
