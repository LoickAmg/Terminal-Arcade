import { describe, expect, it } from "vitest";
import { appendTyped, detectHostile } from "./hostile";

describe("saisie suivie par le serveur", () => {
  it("reconstitue les lignes, effacements et Ctrl+C compris", () => {
    let r = appendTyped("", "tyoe");
    r = appendTyped(r.buffer, "\x7f\x7fpe ls\r");
    expect(r.lines).toEqual(["type ls"]);
    r = appendTyped("", "rm -rf /\x03unalias ls\r");
    expect(r.lines).toEqual(["unalias ls"]);
    expect(appendTyped("", "\x1b[Als\r").lines).toEqual(["ls"]);
  });
});

describe("détection des sabotages hostiles", () => {
  const all = new Set(["hostile_alias", "hostile_path", "hostile_chmod", "hostile_decoy"]);

  it("reconnaît les commandes qui démasquent", () => {
    expect(detectHostile("type ls", all)).toEqual(["hostile_alias", "hostile_path"]);
    expect(detectHostile("\\ls -la", all)).toEqual(["hostile_alias"]);
    expect(detectHostile("echo $PATH", all)).toEqual(["hostile_path"]);
    expect(detectHostile("/bin/cat notes.txt", all)).toEqual(["hostile_path"]);
    expect(detectHostile("chmod 644 notes.txt", all)).toEqual(["hostile_chmod"]);
    expect(detectHostile("rm flag.txt", all)).toEqual(["hostile_decoy"]);
  });

  it("ignore les commandes ordinaires et les sabotages inactifs", () => {
    expect(detectHostile("ls -la && cat notes.txt", all)).toEqual([]);
    expect(detectHostile("chmod +x deploy.sh", new Set(["hostile_alias"]))).toEqual([]);
  });
});
