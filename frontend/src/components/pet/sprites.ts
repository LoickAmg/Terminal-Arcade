import type { PetForm } from "@/lib/pet";

// Dessins en pixel art, un caractère par pixel :
//   .  transparent    o  contour    b  corps    l  reflet (corps éclairci)
// Les yeux, la bouche et les accessoires sont posés par-dessus selon
// l'humeur, à partir des repères (anchors) de chaque forme.

export type Sprite = {
  rows: string[];
  // Jambes : deux images alternées pendant la marche (vide = la forme flotte).
  legs: [string[], string[]];
  eyes: [number, number][]; // coin haut-gauche de chaque œil (2×2)
  mouth: [number, number]; // pixel central de la bouche
  head: { left: number; right: number; top: number };
};

export const SPRITES: Record<PetForm, Sprite> = {
  chat: {
    rows: [
      ".o..........o.",
      "obo........obo",
      "obbo......obbo",
      "obbboooooobbbo",
      "obbbbbbbbbbbbo",
      "obbbbbbbbbbbbo",
      "obbbbbbbbbbbbo",
      "obbbbbbbbbbbbo",
      "oblbbbbbbbbbbo",
      ".obbbbbbbbbbo.",
      "..oooooooooo..",
    ],
    legs: [
      ["...ob....bo...", "...oo....oo..."],
      ["..ob......bo..", "..oo......oo.."],
    ],
    eyes: [
      [3, 5],
      [9, 5],
    ],
    mouth: [6, 8],
    head: { left: 1, right: 12, top: 3 },
  },
  robot: {
    rows: [
      "......oo......",
      ".......o......",
      "...oooooooo...",
      "..obbbbbbbbo..",
      "..obbbbbbbbo..",
      "..obbbbbbbbo..",
      "..oblbbbbbbo..",
      "...oooooooo...",
      "..obbbbbbbbo..",
      "..obllllllbo..",
      "..obbbbbbbbo..",
      "...oooooooo...",
    ],
    legs: [
      ["....ob..bo....", "....oo..oo...."],
      ["...ob....bo...", "...oo....oo..."],
    ],
    eyes: [
      [4, 4],
      [8, 4],
    ],
    mouth: [6, 6],
    head: { left: 2, right: 11, top: 2 },
  },
  fantome: {
    rows: [
      "....oooooo....",
      "..oobbbbbboo..",
      ".obbbbbbbbbbo.",
      ".obbbbbbbbbbo.",
      "obbbbbbbbbbbbo",
      "obbbbbbbbbbbbo",
      "oblbbbbbbbbbbo",
      "obbbbbbbbbbbbo",
      "obbbbbbbbbbbbo",
      "obbobbobbobbbo",
      "oo.oo.oo.oo.oo",
    ],
    legs: [[], []],
    eyes: [
      [3, 4],
      [9, 4],
    ],
    mouth: [6, 7],
    head: { left: 1, right: 12, top: 0 },
  },
};
