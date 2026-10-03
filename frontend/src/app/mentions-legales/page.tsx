import type { Metadata } from "next";
import { H2, LegalPage } from "@/components/LegalPage";
import { LEGAL, contact } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur, hébergeurs et contact de Terminal Arcade.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales">
      <H2>Éditeur</H2>
      <p>
        Terminal Arcade est un jeu gratuit, édité à titre personnel par {LEGAL.name}, {LEGAL.city}.
        <br />
        Contact : {contact()}
      </p>
      <p>Directeur de la publication : {LEGAL.name}.</p>

      <H2>Hébergement</H2>
      <ul className="list-disc pl-5">
        <li>Site et comptes : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (exécution en Europe, Francfort).</li>
        <li>Base de données : Neon (Databricks), serveurs en Europe (Francfort, Allemagne).</li>
        <li>E-mails : Resend (Plus Five Five, Inc.), États-Unis.</li>
        <li>Terminal « vrai Linux » : serveur exploité par l&apos;éditeur.</li>
      </ul>

      <H2>Propriété</H2>
      <p>
        Le code, les textes, le dessin d&apos;accueil et les exercices de Terminal Arcade appartiennent à leur auteur.
        Les noms de logiciels cités (Linux, Git, PowerShell…) sont la propriété de leurs titulaires respectifs. Les
        thèmes inspirés d&apos;œuvres existantes sont des hommages, sans lien avec leurs ayants droit.
      </p>

      <H2>Signaler un problème</H2>
      <p>
        Faille de sécurité, contenu inapproprié ou erreur : écris à {contact()}. Les failles sont traitées en priorité.
      </p>
    </LegalPage>
  );
}
