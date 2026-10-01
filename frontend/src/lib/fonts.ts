import { Anton, Archivo, JetBrains_Mono } from "next/font/google";

// Anton : titres et tampons (gras, condensé, esprit affiche).
// Archivo : textes de l'interface. JetBrains Mono : le terminal.
export const display = Anton({ weight: "400", subsets: ["latin"], variable: "--ff-display" });
export const sans = Archivo({ subsets: ["latin"], variable: "--ff-sans" });
export const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--ff-mono" });
