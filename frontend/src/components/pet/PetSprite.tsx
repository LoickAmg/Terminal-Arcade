import { colorHex, type PetConfig } from "@/lib/pet";
import { SPRITES } from "./sprites";

export type PetMood = "idle" | "happy" | "sad" | "think" | "sleep" | "cheer";

type Pixel = [x: number, y: number, color: string];

const INK = "#111111";
const CAP = "#6FD6F2";
const CUP = "#E0141E";

function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function pixels(config: PetConfig, mood: PetMood, frame: 0 | 1): Pixel[] {
  const sprite = SPRITES[config.form];
  const body = colorHex(config.color);
  const palette: Record<string, string> = { o: INK, b: body, l: lighten(body, 0.5) };
  const out: Pixel[] = [];

  const rows = [...sprite.rows, ...sprite.legs[frame]];
  rows.forEach((row, y) =>
    Array.from(row).forEach((ch, x) => {
      if (palette[ch]) out.push([x, y, palette[ch]]);
    }),
  );

  // Yeux : ouverts (2×2), fermés vers le bas (sommeil, tristesse) ou
  // plissés vers le haut (joie).
  for (const [ex, ey] of sprite.eyes) {
    if (mood === "sleep" || mood === "sad") {
      out.push([ex, ey + 1, INK], [ex + 1, ey + 1, INK]);
    } else if (mood === "happy" || mood === "cheer" || mood === "think") {
      out.push([ex, ey, INK], [ex + 1, ey, INK]);
    } else {
      out.push([ex, ey, INK], [ex + 1, ey, INK], [ex, ey + 1, INK], [ex + 1, ey + 1, INK]);
    }
  }

  const [mx, my] = sprite.mouth;
  if (mood === "happy" || mood === "cheer") out.push([mx, my, INK], [mx + 1, my, INK]);
  else if (mood === "sad") out.push([mx, my + 1, INK], [mx + 1, my, INK]);
  else out.push([mx, my, INK]);

  const { left, right, top } = sprite.head;
  const [[e1x, e1y], [e2x]] = sprite.eyes;
  switch (config.accessory) {
    case "casquette":
      for (let x = left + 2; x <= right - 2; x++) out.push([x, top - 2, CAP]);
      for (let x = left + 1; x <= right - 1; x++) out.push([x, top - 1, CAP]);
      for (let x = right; x <= right + 2; x++) out.push([x, top - 1, INK]);
      break;
    case "lunettes":
      // Lunettes noires : deux verres de 4×2 sur les yeux, un pont, un reflet.
      for (const ex of [e1x, e2x]) {
        for (let d = -1; d <= 2; d++) out.push([ex + d, e1y, INK], [ex + d, e1y + 1, INK]);
        out.push([ex - 1, e1y, "#FFFFFF"]);
      }
      for (let x = e1x + 3; x < e2x - 1; x++) out.push([x, e1y, INK]);
      break;
    case "casque":
      for (let x = left + 1; x <= right - 1; x++) out.push([x, top - 1, INK]);
      for (let y = e1y - 1; y <= e1y + 2; y++) {
        out.push([left - 1, y, CUP], [left, y, CUP], [right, y, CUP], [right + 1, y, CUP]);
      }
      break;
  }
  return out;
}

export function PetSprite({
  config,
  mood = "idle",
  frame = 0,
  size = 56,
  title,
}: {
  config: PetConfig;
  mood?: PetMood;
  frame?: 0 | 1;
  size?: number;
  title?: string;
}) {
  const px = pixels(config, mood, frame);
  // Cadre fixe par forme, assez large pour tous les accessoires, pour que
  // le compagnon ne « saute » pas quand il change d'humeur ou d'accessoire.
  const sprite = SPRITES[config.form];
  const width = sprite.rows[0].length;
  const height = sprite.rows.length + 2;
  const viewBox = `-2 -3 ${width + 4} ${height + 3}`;

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={(size * (height + 3)) / (width + 4)}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {px.map(([x, y, color], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill={color} />
      ))}
    </svg>
  );
}
