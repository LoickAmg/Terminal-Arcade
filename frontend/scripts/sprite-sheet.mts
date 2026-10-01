// Planche de contrôle des sprites d'Arcade (toutes formes, humeurs,
// accessoires et styles), rendue en PNG pour la relire sans navigateur.
//   npx tsx scripts/sprite-sheet.mts <sortie.png>
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import { PetSprite, type PetMood } from "../src/components/pet/PetSprite";
import { PET_ACCESSORIES, PET_FORMS, type PetConfig } from "../src/lib/pet";

const moods: PetMood[] = ["idle", "happy", "sad", "sleep"];
const cell = 96;
const cells: string[] = [];
let row = 0;

for (const style of ["pixel", "persona"] as const) {
  for (const form of PET_FORMS) {
    PET_ACCESSORIES.forEach((acc, a) => {
      moods.forEach((mood, m) => {
        const config: PetConfig = { name: "Arcade", form: form.id, color: "cyan", accessory: acc.id, style };
        const svg = renderToStaticMarkup(createElement(PetSprite, { config, mood, size: 72 }));
        cells.push(`<g transform="translate(${(a * moods.length + m) * cell + 12},${row * cell + 12})">${svg}</g>`);
      });
    });
    row++;
  }
}

const width = PET_ACCESSORIES.length * moods.length * cell;
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${row * cell}"><rect width="100%" height="100%" fill="#e0141e"/>${cells.join("")}</svg>`;
await sharp(Buffer.from(sheet)).png().toFile(process.argv[2] ?? "sprites.png");
console.log("ok");
