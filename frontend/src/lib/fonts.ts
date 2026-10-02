import { Anton, Archivo, JetBrains_Mono } from "next/font/google";

// Archivo (variable, axe de largeur, italique) : textes de l'interface et
// grands titres du thème Seuil, très gras, élargis et penchés.
// Anton : titres façon affiche des thèmes Persona. JetBrains Mono : le
// terminal et les étiquettes.
export const display = Anton({ weight: "400", subsets: ["latin"], variable: "--ff-display" });
export const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--ff-sans",
});
export const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--ff-mono" });
