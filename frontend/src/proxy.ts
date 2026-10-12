import { NextResponse, type NextRequest } from "next/server";
import { maintenanceHtml, maintenanceOn } from "@/lib/maintenance";

// Mode maintenance (MAINTENANCE_MODE=1) : 503 partout sauf /api/health, que la
// surveillance continue d'interroger. Hors maintenance, rien ne change.

const RETRY_AFTER_S = "600";

export function proxy(request: NextRequest) {
  if (!maintenanceOn()) return NextResponse.next();
  const headers = { "Retry-After": RETRY_AFTER_S, "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "maintenance", message: "Le jeu est en maintenance." }, { status: 503, headers });
  }
  return new NextResponse(maintenanceHtml(), {
    status: 503,
    headers: {
      ...headers,
      "Content-Type": "text/html; charset=utf-8",
      // Page sans script : une politique plus stricte que celle du site.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'",
    },
  });
}

export const config = {
  // Ni les fichiers du build, ni les icônes, ni le contrôle de santé.
  matcher: ["/((?!_next/static|_next/image|api/health|icon.svg|favicon.ico).*)"],
};
