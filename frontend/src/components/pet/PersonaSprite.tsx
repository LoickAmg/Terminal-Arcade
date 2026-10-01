import { colorHex, type PetConfig } from "@/lib/pet";
import type { PetMood } from "./PetSprite";

// Arcade façon Persona : silhouette noire anguleuse, contour blanc épais,
// regard dans la couleur choisie, accent rouge. Formes vectorielles plutôt
// que pixels ; mêmes humeurs et mêmes accessoires que la version pixel art.

const INK = "#0A0A0A";
const PAPER = "#FFFFFF";
const RED = "#E0141E";

type Geometry = {
  body: string;
  legs: [string, string];
  // Centre de chaque œil et largeur d'un œil.
  eyes: [number, number][];
  eyeW: number;
  mouth: [number, number];
  headTop: number;
  left: number;
  right: number;
};

const GEOMETRY: Record<PetConfig["form"], Geometry> = {
  chat: {
    body: "12,56 15,30 9,6 24,19 40,19 55,6 49,30 52,56",
    legs: ["M17,56 23,56 22,63 16,63Z M41,56 47,56 48,63 42,63Z", "M19,56 25,56 26,63 20,63Z M39,56 45,56 44,63 38,63Z"],
    eyes: [
      [23, 35],
      [41, 35],
    ],
    eyeW: 9,
    mouth: [32, 46],
    headTop: 19,
    left: 12,
    right: 52,
  },
  robot: {
    body: "11,14 53,10 55,44 47,46 47,57 17,57 17,46 9,44",
    legs: ["M19,57 25,57 24,63 18,63Z M39,57 45,57 46,63 40,63Z", "M21,57 27,57 28,63 22,63Z M37,57 43,57 42,63 36,63Z"],
    eyes: [
      [23, 26],
      [41, 25],
    ],
    eyeW: 9,
    mouth: [32, 37],
    headTop: 10,
    left: 10,
    right: 54,
  },
  fantome: {
    body: "32,3 51,13 56,57 48,50 41,60 33,51 25,60 17,50 8,57 13,13",
    legs: ["", ""],
    eyes: [
      [24, 27],
      [40, 27],
    ],
    eyeW: 8,
    mouth: [32, 39],
    headTop: 5,
    left: 12,
    right: 52,
  },
};

function eyes(g: Geometry, mood: PetMood, color: string) {
  return g.eyes.map(([x, y], i) => {
    const w = g.eyeW / 2;
    const side = i === 0 ? 1 : -1; // regard oblique, vers l'intérieur
    switch (mood) {
      case "happy":
      case "cheer":
        return <polyline key={i} points={`${x - w},${y + 2} ${x},${y - 3} ${x + w},${y + 2}`} fill="none" stroke={color} strokeWidth={3} />;
      case "sad":
        return <line key={i} x1={x - w} y1={y - 2 * side} x2={x + w} y2={y + 2 * side} stroke={color} strokeWidth={3} />;
      case "sleep":
        return <line key={i} x1={x - w} y1={y + 1} x2={x + w} y2={y + 1} stroke={color} strokeWidth={2.5} />;
      default:
        return (
          <polygon
            key={i}
            points={`${x - w},${y + side} ${x + w},${y - 2 - side} ${x + w - 1},${y + 3} ${x - w + 1},${y + 3}`}
            fill={color}
          />
        );
    }
  });
}

function accessory(config: PetConfig, g: Geometry) {
  const [[e1x, ey], [e2x]] = g.eyes;
  switch (config.accessory) {
    case "casquette":
      return (
        <g>
          <polygon
            points={`${g.left + 2},${g.headTop + 2} ${g.right - 2},${g.headTop - 1} ${g.right - 6},${g.headTop - 10} ${g.left + 6},${g.headTop - 8}`}
            fill={INK}
            stroke={PAPER}
            strokeWidth={2.5}
          />
          <polygon points={`${g.right - 4},${g.headTop - 1} ${g.right + 9},${g.headTop + 1} ${g.right - 2},${g.headTop - 5}`} fill={RED} />
        </g>
      );
    case "lunettes":
      return (
        <g>
          <polygon
            points={`${e1x - g.eyeW},${ey - 5} ${e2x + g.eyeW},${ey - 7} ${e2x + g.eyeW - 1},${ey + 5} ${e1x - g.eyeW + 1},${ey + 6}`}
            fill={PAPER}
            stroke={INK}
            strokeWidth={1.5}
          />
          <polygon points={`${e1x - 2},${ey - 5} ${e1x + 4},${ey - 6} ${e1x - 1},${ey + 5} ${e1x - 6},${ey + 6}`} fill={RED} />
        </g>
      );
    case "casque":
      return (
        <g>
          <path
            d={`M${g.left + 1},${ey} Q32,${g.headTop - 22} ${g.right - 1},${ey}`}
            fill="none"
            stroke={PAPER}
            strokeWidth={4}
          />
          <path d={`M${g.left + 1},${ey} Q32,${g.headTop - 22} ${g.right - 1},${ey}`} fill="none" stroke={INK} strokeWidth={2} />
          <polygon points={`${g.left - 4},${ey - 6} ${g.left + 4},${ey - 7} ${g.left + 4},${ey + 7} ${g.left - 3},${ey + 6}`} fill={RED} stroke={PAPER} strokeWidth={1.5} />
          <polygon points={`${g.right - 4},${ey - 7} ${g.right + 4},${ey - 6} ${g.right + 3},${ey + 6} ${g.right - 4},${ey + 7}`} fill={RED} stroke={PAPER} strokeWidth={1.5} />
        </g>
      );
    default:
      return null;
  }
}

export function PersonaSprite({
  config,
  mood,
  frame,
  size,
  title,
}: {
  config: PetConfig;
  mood: PetMood;
  frame: 0 | 1;
  size: number;
  title?: string;
}) {
  const g = GEOMETRY[config.form];
  const accent = colorHex(config.color);
  const [mx, my] = g.mouth;
  const mouth =
    mood === "happy" || mood === "cheer" ? (
      <polygon points={`${mx - 5},${my} ${mx + 5},${my - 1} ${mx},${my + 5}`} fill={RED} stroke={PAPER} strokeWidth={1.5} />
    ) : mood === "sad" ? (
      <polyline points={`${mx - 4},${my + 3} ${mx},${my} ${mx + 4},${my + 3}`} fill="none" stroke={PAPER} strokeWidth={2} />
    ) : (
      <polyline points={`${mx - 4},${my} ${mx - 1},${my + 2} ${mx + 2},${my} ${mx + 4},${my + 2}`} fill="none" stroke={PAPER} strokeWidth={2} />
    );

  return (
    <svg
      viewBox="-6 -14 76 80"
      width={size}
      height={(size * 80) / 76}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      strokeLinejoin="miter"
    >
      {g.legs[frame] && <path d={g.legs[frame]} fill={INK} stroke={PAPER} strokeWidth={2} />}
      <polygon points={g.body} fill={INK} stroke={PAPER} strokeWidth={3.5} />
      {/* Éclat rouge en biais sur le corps : la signature visuelle. */}
      <polygon points={`${g.left + 6},${g.headTop + 30} ${g.left + 14},${g.headTop + 27} ${g.left + 10},${g.headTop + 36}`} fill={RED} />
      {eyes(g, mood, accent)}
      {mouth}
      {accessory(config, g)}
    </svg>
  );
}
