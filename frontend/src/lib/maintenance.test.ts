import { afterEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { maintenanceHtml } from "./maintenance";
import { proxy } from "../proxy";

describe("maintenance", () => {
  afterEach(() => {
    delete process.env.MAINTENANCE_MODE;
  });

  it("échappe le message et n'accepte qu'un lien https", () => {
    const html = maintenanceHtml("<script>alert(1)</script>", "javascript:alert(1)");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("javascript:");
    expect(maintenanceHtml("ok", "https://stats.uptimerobot.com/abc")).toContain('href="https://stats.uptimerobot.com/abc"');
  });

  it("laisse tout passer hors maintenance", () => {
    const res = proxy(new NextRequest("http://localhost/"));
    expect(res.headers.get("x-middleware-next")).toBe("1");
  });

  it("répond 503 aux pages et à l'API en maintenance", async () => {
    process.env.MAINTENANCE_MODE = "1";
    const page = proxy(new NextRequest("http://localhost/"));
    expect(page.status).toBe(503);
    expect(page.headers.get("retry-after")).toBe("600");
    expect(await page.text()).toContain("Maintenance");
    const api = proxy(new NextRequest("http://localhost/api/save"));
    expect(api.status).toBe(503);
    expect(await api.json()).toMatchObject({ error: "maintenance" });
  });
});
