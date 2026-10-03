import type { Metadata } from "next";
import { H2, LegalPage } from "@/components/LegalPage";
import { LEGAL, contact } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description: "Les règles du jeu Terminal Arcade : compte, classement, terminal en ligne.",
  alternates: { canonical: "/cgu" },
};

export default function Cgu() {
  return (
    <LegalPage title="Conditions d'utilisation">
      <H2>Le service</H2>
      <p>
        Terminal Arcade est un jeu gratuit pour apprendre le terminal. On peut y jouer sans compte. Un compte, facultatif,
        sauvegarde la progression en ligne et donne une place au classement. En créant un compte, tu acceptes ces
        conditions et la politique de confidentialité.
      </p>

      <H2>Âge</H2>
      <p>
        Il faut avoir 15 ans ou plus pour créer un compte. Entre 15 et 18 ans, tu dois avoir l&apos;accord d&apos;un
        parent ou de la personne qui exerce l&apos;autorité parentale.
      </p>

      <H2>Ton compte</H2>
      <ul className="list-disc pl-5">
        <li>Tu es responsable de ton mot de passe ; choisis-en un que tu n&apos;utilises nulle part ailleurs.</li>
        <li>Ton pseudo est public : pas d&apos;insulte, d&apos;usurpation d&apos;identité ni de contenu illégal.</li>
        <li>
          Si tu te connectes uniquement avec Google et perds l&apos;accès à ce compte Google, nous ne pouvons pas
          vérifier ton identité autrement : ajoute un mot de passe depuis le menu Compte pour garder un second accès.
        </li>
        <li>Tu peux supprimer ton compte à tout moment ; la suppression est définitive.</li>
      </ul>

      <H2>Classement et triche</H2>
      <p>
        Le classement doit refléter le jeu réel. Modifier sa sauvegarde, automatiser les réponses ou exploiter une
        faille pour gagner de l&apos;XP est interdit : un compte qui triche peut être retiré du classement ou supprimé.
      </p>

      <H2>Le terminal « vrai Linux »</H2>
      <p>
        Les niveaux en sandbox ouvrent un vrai système dans un conteneur isolé. Il sert à jouer, pas à autre chose :
        interdit de tenter d&apos;en sortir, d&apos;attaquer le serveur ou d&apos;autres joueurs, de miner, ou de le
        saturer volontairement. Le temps et les ressources sont limités, et l&apos;accès peut être suspendu en cas
        d&apos;abus. Si tu trouves une faille, signale-la à {contact()} plutôt que de l&apos;exploiter.
      </p>

      <H2>Disponibilité et responsabilité</H2>
      <p>
        Le jeu est fourni tel quel, gratuitement, sans garantie de disponibilité permanente. L&apos;éditeur fait de son
        mieux pour préserver les sauvegardes, mais ne peut être tenu responsable d&apos;une interruption ou d&apos;une
        perte de progression.
      </p>

      <H2>Modifications</H2>
      <p>
        Ces conditions peuvent évoluer ; la date de mise à jour figure en haut de la page. En cas de changement
        important, les joueurs ayant un compte en sont informés.
      </p>

      <H2>Droit applicable</H2>
      <p>
        Ces conditions relèvent du droit de la République du Bénin. Avant toute action, écris-nous ({contact()}) pour
        chercher une solution amiable ; à défaut, les juridictions de Cotonou sont compétentes, sans préjudice des
        droits que la loi de ton pays de résidence t&apos;accorde.
      </p>
      <p className="text-muted">Éditeur : {LEGAL.name}, {LEGAL.city}.</p>
    </LegalPage>
  );
}
