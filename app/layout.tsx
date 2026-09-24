import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VigiSafe",
  description: "Plateforme de declaration des hazards et de prevention SST"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
