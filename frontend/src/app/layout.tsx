import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { CookieNotice } from "@/components/CookieNotice";
import { ServiceWorker } from "@/components/ServiceWorker";
import { LEGAL } from "@/lib/legal";
import { display, mono, sans } from "@/lib/fonts";
import { themeBootScript } from "@/lib/themes";
import "./globals.css";

const DESCRIPTION =
  "Apprends le terminal en jouant : commandes, QCM, pièges, un vrai Linux en ligne, Git, PowerShell et un compagnon qui triche. Gratuit, en français.";

export const metadata: Metadata = {
  metadataBase: new URL(LEGAL.site),
  title: { default: "Terminal Arcade : apprends le terminal en jouant", template: "%s · Terminal Arcade" },
  description: DESCRIPTION,
  applicationName: "Terminal Arcade",
  alternates: { canonical: "/" },
  keywords: ["terminal", "ligne de commande", "linux", "bash", "git", "powershell", "jeu", "apprendre"],
  openGraph: { type: "website", locale: "fr_FR", siteName: "Terminal Arcade", title: "Terminal Arcade", description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: "Terminal Arcade", description: DESCRIPTION },
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
        <CookieNotice />
        <ServiceWorker />
        {/* Mesure d'audience sans cookie, servie par le site lui-même sur Vercel.
            En développement, elle chargerait un script externe que la CSP bloque. */}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
