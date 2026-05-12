import "./globals.css";

export const metadata = {
  title: {
    template: "%s / Vcinema ",
    default: "Welcome / Vcinema!",
  },
  description: "Movie discovery and watched list",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
