import type { MetadataRoute } from "next";
import { LEGAL } from "@/lib/legal";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/reinitialiser"] },
    sitemap: new URL("/sitemap.xml", LEGAL.site).toString(),
  };
}
