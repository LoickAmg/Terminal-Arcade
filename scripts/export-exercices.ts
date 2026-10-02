// Génère docs/exercices.md : le catalogue lisible de tous les niveaux,
// questions, réponses, indices et défis de Terminal Arcade, à partir des
// fichiers YAML (source unique). À relancer après chaque ajout de niveau :
//   npm run export:exercices
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadLevels } from "@terminal-arcade/shared/loader";
import {
  TIERS,
  TIER_LABELS,
  TREE_LABELS,
  type Level,
  type Question,
} from "@terminal-arcade/shared";

const root = join(import.meta.dirname, "..");
const levels = loadLevels(join(root, "shared", "levels"));

const KIND: Record<Question["kind"], string> = {
  command: "Commande",
  mcq: "QCM",
  trap: "Piège",
  predict: "Prédire la sortie",
  fill: "Compléter",
  task: "Défi réel (sandbox)",
};

const TYPE: Record<Level["type"], string> = {
  classic: "Classique",
  timer: "Timer",
  chaos: "Chaos",
  chaos_timer: "Chaos + Timer",
};

const code = (text: string, lang = "") => `\`\`\`${lang}\n${text.trimEnd()}\n\`\`\``;
const inline = (text: string) => `\`${text.replace(/`/g, "'")}\``;
// Ancre telle que GitHub la calcule pour un titre : minuscules, ponctuation
// retirée (sauf - et _), espaces remplacés par des tirets.
const anchor = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .replace(/ /g, "-");
const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n/g, " ");

function runtime(level: Level): string {
  if (level.runtime === "browser") return "Navigateur";
  return level.shell === "pwsh" ? "Sandbox Docker (PowerShell)" : "Sandbox Docker (bash)";
}

function question(q: Question, title: string): string[] {
  const out = [`#### ${title} · ${KIND[q.kind]}`, "", q.prompt, ""];
  if (q.kind === "fill") out.push(code(q.template, "bash"), "");
  if ("code" in q && q.code) out.push(code(q.code, "bash"), "");
  if (q.kind === "mcq" || q.kind === "trap") {
    q.choices.forEach((c, i) => out.push(`${i + 1}. ${i + 1 === q.answer ? `**${c}** ✔` : c}`));
    out.push("");
  }
  if (q.kind === "command" || q.kind === "fill" || q.kind === "predict") {
    out.push(`- Réponses acceptées : ${q.accept.map(inline).join(", ")}`);
  }
  if (q.kind === "command" && q.output) out.push(`- Sortie simulée : ${inline(q.output.trim().split("\n").join(" ⏎ "))}`);
  if (q.kind === "task") {
    out.push(`- Solution : ${inline(q.solution)}`);
    if (q.flag) out.push("- Flag aléatoire à chaque partie ($FLAG)");
  }
  if (q.explain) out.push(`- Explication : ${q.explain}`);
  q.hints.forEach((h, i) => out.push(`- Indice ${i + 1} (${h.cost_s} s) : ${h.text}`));
  if (q.kind === "task") {
    out.push("", "<details><summary>Préparation et arbitre</summary>", "");
    if (q.setup) out.push("Préparation :", "", code(q.setup, "bash"), "");
    out.push("Arbitre (0 = réussi, 1 = pas encore, 2 = mauvaise réponse) :", "", code(q.check, "bash"), "");
    if (q.solve) out.push("Résolution automatique (tests) :", "", code(q.solve, "bash"), "");
    out.push("</details>");
  }
  out.push("");
  return out;
}

function level(l: Level): string[] {
  const out = [`### ${l.id} — ${l.title}`, "", `> ${l.hook}`, ""];
  const rows: [string, string][] = [
    ["Palier", TIER_LABELS[l.tier]],
    ["Arbre", TREE_LABELS[l.tree]],
    ["Exécution", runtime(l)],
    ["Type natif", TYPE[l.type]],
    ["Rejouable", [l.replay.timer && "Timer", l.replay.chaos && "Chaos"].filter(Boolean).join(", ") || "non"],
    ["Questions", String(l.questions.length)],
    ["XP", String(l.rewards.xp)],
  ];
  if (l.timer) {
    rows.push([
      "Timer",
      `${l.timer.mode}, ${l.timer.duration_s} s (référence ${l.timer.par_s} s${l.timer.deficit_s ? `, retard ${l.timer.deficit_s} s` : ""})`,
    ]);
  }
  if (l.chaos?.signature.length) rows.push(["Sabotages signature", l.chaos.signature.join(", ")]);
  if (l.rewards.unlocks.length) rows.push(["Débloque", l.rewards.unlocks.join(", ")]);
  out.push("| | |", "| --- | --- |", ...rows.map(([k, v]) => `| ${k} | ${cell(v)} |`), "");
  if (l.intro) out.push(l.intro, "");
  if (l.setup) out.push("<details><summary>Préparation du niveau</summary>", "", code(l.setup, "bash"), "", "</details>", "");
  l.questions.forEach((q, i) => {
    out.push(...question(q, `Q${i + 1}`));
    if (q.variant) out.push(...question(q.variant, `Q${i + 1} — variante (sabotage « mutation »)`));
  });
  return out;
}

const questionCount = levels.reduce((n, l) => n + l.questions.length, 0);
const variantCount = levels.reduce((n, l) => n + l.questions.filter((q) => q.variant).length, 0);
const byKind = Object.keys(KIND).map(
  (k) => [KIND[k as Question["kind"]], levels.flatMap((l) => l.questions).filter((q) => q.kind === k).length] as const,
);

const lines = [
  "# Catalogue des exercices de Terminal Arcade",
  "",
  "Généré automatiquement depuis `shared/levels/` par `npm run export:exercices`.",
  "Ne pas modifier à la main : modifier les fichiers YAML, puis régénérer.",
  "",
  `**${levels.length} niveaux, ${questionCount} questions, ${variantCount} variantes.**`,
  "",
  "| Type de question | Nombre |",
  "| --- | --- |",
  ...byKind.map(([k, n]) => `| ${k} | ${n} |`),
  "",
  "## Vue d'ensemble",
  "",
  "| Niveau | Titre | Palier | Arbre | Exécution | Type | Questions | XP |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ...levels.map(
    (l) =>
      `| [${l.id}](#${anchor(`${l.id} — ${l.title}`)}) | ${cell(l.title)} | ${TIER_LABELS[l.tier]} | ${TREE_LABELS[l.tree]} | ${runtime(l)} | ${TYPE[l.type]} | ${l.questions.length} | ${l.rewards.xp} |`,
  ),
  "",
];

for (const tier of TIERS) {
  const list = levels.filter((l) => l.tier === tier);
  if (list.length === 0) continue;
  lines.push(`## Palier ${TIER_LABELS[tier]}`, "");
  for (const l of list) lines.push(...level(l));
}

mkdirSync(join(root, "docs"), { recursive: true });
writeFileSync(join(root, "docs", "exercices.md"), lines.join("\n"), "utf8");
console.log(`docs/exercices.md : ${levels.length} niveaux, ${questionCount} questions, ${variantCount} variantes`);
