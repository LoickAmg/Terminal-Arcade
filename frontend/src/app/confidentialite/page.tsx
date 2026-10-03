import type { Metadata } from "next";
import { H2, LegalPage } from "@/components/LegalPage";
import { LEGAL, contact } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données Terminal Arcade collecte, pourquoi, combien de temps, et tes droits.",
  alternates: { canonical: "/confidentialite" },
};

export default function Confidentialite() {
  return (
    <LegalPage title="Confidentialité">
      <p>
        Terminal Arcade collecte le moins de données possible. Sans compte, rien ne quitte ton navigateur : ta
        progression, ton compagnon et tes réglages restent dans le stockage local de ton appareil.
      </p>

      <H2>Responsable du traitement</H2>
      <p>
        {LEGAL.name}, {LEGAL.city}. Contact : {contact()}.
      </p>

      <H2>Cadre légal</H2>
      <p>
        Les traitements relèvent du Code du numérique de la République du Bénin (loi n° 2017-20, livre V) et sont
        déclarés à l&apos;Autorité de Protection des Données à caractère Personnel (APDP). Pour les joueurs situés dans
        l&apos;Union européenne, le Règlement général sur la protection des données (RGPD) s&apos;applique également.
      </p>

      <H2>Données collectées avec un compte</H2>
      <ul className="list-disc pl-5">
        <li>Adresse e-mail et pseudo : pour te connecter et t&apos;afficher au classement (seul le pseudo est public).</li>
        <li>Mot de passe : jamais stocké tel quel, seulement une empreinte Argon2id.</li>
        <li>Connexion Google (si tu la choisis) : ton identifiant Google, ton nom et ton adresse ; les jetons fournis par Google sont chiffrés.</li>
        <li>Sauvegarde : niveaux réussis, XP, compagnon, réglages du jeu.</li>
        <li>Sessions : date, adresse IP et navigateur de chaque connexion, pour la sécurité du compte.</li>
      </ul>
      <p>Base légale : l&apos;exécution du service que tu demandes en créant un compte, et notre intérêt légitime à le sécuriser.</p>

      <H2>Durées de conservation</H2>
      <ul className="list-disc pl-5">
        <li>Compte jamais confirmé : supprimé automatiquement au bout de 30 jours.</li>
        <li>Compte confirmé : tant que tu le gardes. Le supprimer efface immédiatement le compte, la sauvegarde et le classement.</li>
        <li>Sessions : 30 jours au plus. Liens envoyés par e-mail : 24 heures (confirmation) ou une heure (mot de passe).</li>
        <li>Journaux techniques de l&apos;hébergeur : quelques jours, pour diagnostiquer les pannes et les abus.</li>
      </ul>

      <H2>Destinataires et transferts</H2>
      <p>
        Personne n&apos;achète ni ne reçoit tes données. Elles sont traitées par nos sous-traitants techniques :
        Vercel (hébergement, exécution en Europe), Neon (base de données, Francfort), Resend (envoi des e-mails) et
        Google si tu utilises la connexion Google. Ces services sont situés hors du Bénin, en Europe et aux États-Unis :
        ces transferts sont encadrés conformément au Code du numérique et, pour les joueurs européens, au RGPD.
      </p>

      <H2>Cookies et mesure d&apos;audience</H2>
      <p>
        Le seul cookie est celui de ta session de connexion : il est strictement nécessaire, ne sert qu&apos;à te
        garder connecté et n&apos;est lisible par aucun script de la page. Le jeu utilise aussi le stockage local de
        ton navigateur pour ta progression et tes préférences.
      </p>
      <p>
        La fréquentation est mesurée avec Vercel Web Analytics, sans cookie ni identifiant persistant : les visites
        sont comptées de façon agrégée, sans suivi d&apos;un site à l&apos;autre ni croisement avec d&apos;autres données.
        L&apos;adresse IP sert seulement à cette mesure et n&apos;est pas conservée par nous.
      </p>

      <H2>Tes droits</H2>
      <p>
        Tu peux accéder à tes données, les corriger, les exporter (bouton « Exporter mes données » dans le menu
        Compte), t&apos;opposer à un traitement ou tout effacer (« Supprimer mon compte »). Pour toute autre demande :{" "}
        {contact()}. Tu peux aussi saisir l&apos;APDP (Bénin) ou, si tu vis dans l&apos;Union européenne, l&apos;autorité
        de protection des données de ton pays.
      </p>

      <H2>Mineurs</H2>
      <p>
        Un compte n&apos;est ouvert qu&apos;à partir de 15 ans. Entre 15 et 18 ans, il faut l&apos;accord d&apos;un parent.
        Le jeu sans compte ne collecte aucune donnée.
      </p>

      <H2>Sécurité</H2>
      <p>
        Connexions en HTTPS, mots de passe hachés, sessions révocables (changer de mot de passe déconnecte tous tes
        appareils), limitation des tentatives, sauvegardes chiffrées de la base. Le terminal « vrai Linux » tourne
        dans un conteneur isolé, sans accès à Internet, détruit à la fin de chaque partie.
      </p>
    </LegalPage>
  );
}
