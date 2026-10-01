import { isObject } from "./storage";

// Configuration du compagnon. Le style « persona » est prévu par le cahier
// des charges ; seul le pixel art est dessiné pour le MVP.

export const PET_FORMS = [
  { id: "chat", label: "Chat" },
  { id: "robot", label: "Robot" },
  { id: "fantome", label: "Fantôme" },
] as const;

export const PET_COLORS = [
  { id: "blanc", label: "Blanc", hex: "#F4F1EA" },
  { id: "cyan", label: "Cyan", hex: "#6FD6F2" },
  { id: "jaune", label: "Jaune", hex: "#FFD23F" },
  { id: "orange", label: "Orange", hex: "#F07818" },
  { id: "violet", label: "Violet", hex: "#B58CFF" },
  { id: "gris", label: "Gris", hex: "#A7ADB4" },
] as const;

export const PET_ACCESSORIES = [
  { id: "aucun", label: "Aucun" },
  { id: "casquette", label: "Casquette" },
  { id: "lunettes", label: "Lunettes" },
  { id: "casque", label: "Casque audio" },
] as const;

export type PetForm = (typeof PET_FORMS)[number]["id"];
export type PetColor = (typeof PET_COLORS)[number]["id"];
export type PetAccessory = (typeof PET_ACCESSORIES)[number]["id"];

export type PetConfig = {
  name: string;
  form: PetForm;
  color: PetColor;
  accessory: PetAccessory;
  style: "pixel";
};

export const DEFAULT_PET: PetConfig = {
  name: "Arcade",
  form: "chat",
  color: "blanc",
  accessory: "aucun",
  style: "pixel",
};

export const MAX_PET_NAME = 16;

export function isPetConfig(v: unknown): v is PetConfig {
  return (
    isObject(v) &&
    typeof v.name === "string" &&
    v.name.length > 0 &&
    v.name.length <= MAX_PET_NAME &&
    PET_FORMS.some((f) => f.id === v.form) &&
    PET_COLORS.some((c) => c.id === v.color) &&
    PET_ACCESSORIES.some((a) => a.id === v.accessory) &&
    v.style === "pixel"
  );
}

export function colorHex(color: PetColor): string {
  return PET_COLORS.find((c) => c.id === color)!.hex;
}

/** Nettoie un nom saisi : lettres, chiffres, espaces, tirets ; 16 caractères. */
export function sanitizePetName(input: string): string {
  return Array.from(input.trim().replace(/[^\p{L}\p{N} _-]/gu, ""))
    .slice(0, MAX_PET_NAME)
    .join("")
    .trim();
}
