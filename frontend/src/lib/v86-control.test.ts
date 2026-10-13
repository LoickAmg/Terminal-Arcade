import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadLevels } from "@terminal-arcade/shared/loader";
import { HOSTILE_SCRIPTS, wrapCheck } from "@terminal-arcade/shared/hostile";
import { MAX_CONTROL_LINE, V86Control, escapeLine, runPayload, unescapeLine } from "./v86-control";

describe("canal de contrôle v86", () => {
  it("met un script sur une ligne et le relit à l'identique", () => {
    const script = 'printf "a\\tb\\n" > f\n\techo "c\'est \\\\ ici"\r\n';
    const line = escapeLine(script);
    expect(line).not.toMatch(/[\n\r\t]/);
    expect(unescapeLine(line)).toBe(script);
  });

  it("exporte les variables, apostrophes comprises", () => {
    const payload = runPayload("echo $FLAG", { FLAG: "a'b" });
    expect(payload.startsWith(":")).toBe(true);
    expect(unescapeLine(payload.slice(1))).toBe("export FLAG='a'\\''b'\necho $FLAG\n".slice(0, -1));
  });

  it("associe chaque réponse à son ordre", async () => {
    const sent: string[] = [];
    const control = new V86Control((bytes) => sent.push(new TextDecoder().decode(bytes)));
    const first = control.run("true");
    const second = control.setClock(1_700_000_000);
    expect(sent[0]).toMatch(/^1 run :true\n$/);
    expect(sent[1]).toBe("2 date 1700000000\n");
    for (const byte of new TextEncoder().encode("@@2 0 ok\n@@1 2 ligne\\nsuivante é\r\n")) control.feed(byte);
    await expect(first).resolves.toEqual({ code: 2, output: "ligne\nsuivante é" });
    await expect(second).resolves.toEqual({ code: 0, output: "ok" });
  });

  it("chaque script des niveaux bash tient sur une ligne de contrôle", () => {
    const levels = loadLevels(join(__dirname, "..", "..", "..", "shared", "levels")).filter(
      (l) => l.runtime === "docker" && l.shell === "bash",
    );
    const env = { FLAG: "FLAG{0123456789ab}", SUBMITTED: "/home/agent/.arcade/submitted" };
    const scripts = [
      ...levels.flatMap((l) => [
        l.setup ?? "",
        ...l.questions.flatMap((q) =>
          [q, q.variant].flatMap((t) => (t?.kind === "task" ? [t.setup, wrapCheck(t.check)] : [])),
        ),
      ]),
      ...Object.values(HOSTILE_SCRIPTS).map((s) => s("bash")),
    ];
    for (const script of scripts) {
      const bytes = new TextEncoder().encode(`999 run ${runPayload(script, env)}\n`).length;
      expect(bytes).toBeLessThanOrEqual(MAX_CONTROL_LINE);
    }
  });
});
