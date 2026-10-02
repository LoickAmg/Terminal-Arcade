import type { Metadata, Viewport } from "next";
import { ServiceWorker } from "@/components/ServiceWorker";
import { display, mono, sans } from "@/lib/fonts";
import { themeBootScript } from "@/lib/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terminal Arcade",
  description: "Maîtrise le terminal en jouant : commandes, QCM, pièges, un vrai Linux et un compagnon nommé Arcade.",
  applicationName: "Terminal Arcade",
  appleWebApp: { capable: true, title: "Terminal Arcade", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  // Le clavier virtuel réduit la page au lieu de la recouvrir : la barre de
  // saisie reste visible au-dessus du clavier.
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      data-theme="seuil"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Thème enregistré appliqué avant le premier affichage. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript() }} />
      </head>
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
