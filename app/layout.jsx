import "./globals.css";
import { ThemeProvider } from "next-themes";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_DESCRIPTION =
  "A private journal for the films you've seen. No social feed. No recommendations. Just your taste, over time.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s / Vcinema",
    default: "Vcinema — Watch. Rate. Remember.",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: "Vcinema",
    type: "website",
    title: "Vcinema — Watch. Rate. Remember.",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vcinema — Watch. Rate. Remember.",
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
