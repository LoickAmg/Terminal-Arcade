import type { MetadataRoute } from "next";
import { LEGAL } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: [string, number][] = [
    ["/", 1],
    ["/mentions-legales", 0.3],
    ["/confidentialite", 0.3],
    ["/cgu", 0.3],
  ];
  return pages.map(([path, priority]) => ({
    url: new URL(path, LEGAL.site).toString(),
    changeFrequency: path === "/" ? "weekly" : "yearly",
    priority,
  }));
}
