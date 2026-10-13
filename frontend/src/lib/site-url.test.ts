import { describe, expect, it } from "vitest";
import { authUrl, siteUrl } from "./site-url";

describe("adresse du site", () => {
  it("prend la variable donnée, sans / final", () => {
    expect(siteUrl({ NEXT_PUBLIC_SITE_URL: "https://jeu.example/" })).toBe("https://jeu.example");
    expect(authUrl({ BETTER_AUTH_URL: "https://jeu.example", NEXT_PUBLIC_SITE_URL: "https://autre.example" })).toBe("https://jeu.example");
  });

  it("sinon, l'adresse fournie par Vercel", () => {
    const prod = { VERCEL_ENV: "production", VERCEL_URL: "jeu-abc123.vercel.app", VERCEL_PROJECT_PRODUCTION_URL: "jeu.vercel.app" };
    expect(siteUrl(prod)).toBe("https://jeu.vercel.app");
    expect(authUrl(prod)).toBe("https://jeu.vercel.app");
    expect(authUrl({ ...prod, VERCEL_ENV: "preview" })).toBe("https://jeu-abc123.vercel.app");
  });

  it("en local, le serveur de développement", () => {
    expect(siteUrl({})).toBe("http://localhost:3107");
  });
});
