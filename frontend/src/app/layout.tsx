import type { Metadata, Viewport } from "next";
import { display, mono, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terminal Arcade",
  description: "Maîtrise le terminal en jouant : commandes, QCM, pièges et un compagnon nommé Arcade.",
  applicationName: "Terminal Arcade",
  appleWebApp: { capable: true, title: "Terminal Arcade", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#e0141e",
  width: "device-width",
  initialScale: 1,
  // Le clavier virtuel réduit la page au lieu de la recouvrir : la barre de
  // saisie reste visible au-dessus du clavier.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
