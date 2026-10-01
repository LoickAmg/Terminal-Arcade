import { HOSTILE_SCRIPTS } from "./hostile";
import { createSandbox, runScript } from "./sandbox";

// Vérifie dans une vraie sandbox que chaque sabotage hostile prend effet,
// et qu'il est réparable par le joueur.
//   npm run test:hostile -w backend

// Comme le shell du joueur (interactif, avec TTY) : configuration chargée,
// sabotage déposé appliqué, puis on observe.
const shell = (cmd: string) => `bash -c 'PS1=x; . /etc/bash.bashrc; __arcade_hostile; ${cmd}' 2>/dev/null`;
const TRAPS = "alias ls cat grep 2>/dev/null | grep -Eq \"Permission non|=tac|grep -v\"";

const CASES: [string, string, string][] = [
  ["hostile_alias", shell(TRAPS), shell(`unalias ls cat grep 2>/dev/null; ! ${TRAPS}`)],
  ["hostile_path", shell('[ "$(type -P cat)" = "$HOME/.cache/arcade/bin/cat" ]'), "/bin/cat /etc/hostname >/dev/null"],
  ["hostile_chmod", 'find ~ -maxdepth 2 -type f -perm 000 | grep -q .', 'find ~ -maxdepth 2 -type f -perm 000 -exec chmod 644 {} + && ! find ~ -maxdepth 2 -type f -perm 000 | grep -q .'],
  ["hostile_decoy", 'grep -q "^FLAG{" ~/flag.txt', "rm ~/flag.txt"],
];

async function main() {
  const sandbox = await createSandbox("test-hostile");
  let problems = 0;
  try {
    await runScript(sandbox.container, "echo note > ~/notes.txt");
    for (const [kind, effect, repair] of CASES) {
      const applied = await runScript(sandbox.container, HOSTILE_SCRIPTS[kind]("bash"));
      const seen = await runScript(sandbox.container, effect);
      // Le sabotage est consommé par le premier shell : on le redépose avant la réparation.
      if (kind === "hostile_alias") await runScript(sandbox.container, HOSTILE_SCRIPTS[kind]("bash"));
      const fixed = await runScript(sandbox.container, repair);
      const ok = applied.code === 0 && seen.code === 0 && fixed.code === 0;
      if (!ok) problems++;
      console.log(`${ok ? "✔" : "✘"} ${kind} (appliqué ${applied.code}, visible ${seen.code}, réparable ${fixed.code})`);
    }
  } finally {
    await sandbox.stop();
  }

  // Même chose côté PowerShell : la fonction prompt du profil applique le sabotage.
  const pwsh = await createSandbox("test-hostile-pwsh", "pwsh");
  try {
    const ps = (cmd: string) => `pwsh -NoLogo -Command '. $PROFILE.AllUsersAllHosts; prompt | Out-Null; ${cmd}'`;
    for (const [kind, effect] of [
      ["hostile_alias", ps('if ((Get-Command Get-ChildItem, Get-Content, Select-String).CommandType -contains "Function") { exit 0 } else { exit 1 }')],
      ["hostile_path", ps('if ((Get-Command cat).Source -like "*/.cache/arcade/bin/cat") { exit 0 } else { exit 1 }')],
    ] as const) {
      const applied = await runScript(pwsh.container, HOSTILE_SCRIPTS[kind]("pwsh"));
      const seen = await runScript(pwsh.container, effect);
      const ok = applied.code === 0 && seen.code === 0;
      if (!ok) problems++;
      console.log(`${ok ? "✔" : "✘"} ${kind} (PowerShell : appliqué ${applied.code}, visible ${seen.code})`);
    }
  } finally {
    await pwsh.stop();
  }
  process.exit(problems === 0 ? 0 : 1);
}

void main();
