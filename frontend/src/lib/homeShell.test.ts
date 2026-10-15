import { describe, expect, it } from "vitest";
import { completeHome, runHomeCommand } from "./homeShell";

const themes = [
  { id: "seuil", label: "Seuil" },
  { id: "dark-hour", label: "Heure sombre" },
];
const run = (line: string) => runHomeCommand(line, themes, "seuil");

describe("invite de l'accueil", () => {
  it("Entrée seule, ./entrer ou menu ouvrent le menu", () => {
    for (const line of ["", "   ", "./entrer", "menu", "ENTRER"]) expect(run(line).action).toEqual({ type: "menu" });
  });

  it("ouvre une entrée du menu par son nom, accents ou non", () => {
    expect(run("compte").action).toEqual({ type: "menu", index: 6 });
    expect(run("Réglages").action).toEqual({ type: "menu", index: 8 });
    expect(run("reglages").action).toEqual({ type: "menu", index: 8 });
    expect(run("pourquoi").action).toEqual({ type: "menu", index: 9 });
  });

  it("transmet les commandes du jeu au terminal de jeu", () => {
    expect(run("jouer").action).toEqual({ type: "game" });
    expect(run("ls missions/").action).toEqual({ type: "game", command: "ls missions/" });
    expect(run("open fs_nav_01").action).toEqual({ type: "game", command: "open fs_nav_01" });
  });

  it("change de thème par son identifiant ou son nom", () => {
    expect(run("theme").out.map((l) => l.text).join("\n")).toContain("● seuil");
    expect(run("theme dark-hour").action).toEqual({ type: "theme", id: "dark-hour" });
    expect(run("theme heure sombre").action).toEqual({ type: "theme", id: "dark-hour" });
    expect(run("theme licorne").action).toEqual({ type: "none" });
    expect(run("scanlines on").action).toEqual({ type: "scanlines", on: true });
  });

  it("répond aux commandes inconnues sans rien faire", () => {
    const res = run("rm -rf /");
    expect(res.action).toEqual({ type: "none" });
    expect(res.out[0].tone).toBe("bad");
  });

  it("complète par Tab", () => {
    expect(completeHome("jo", themes)).toEqual(["jouer"]);
    expect(completeHome("theme d", themes)).toEqual(["theme dark-hour"]);
  });
});
