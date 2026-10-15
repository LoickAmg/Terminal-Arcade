// « Pourquoi Terminal Arcade ? » : à quoi sert le terminal, ce que le jeu
// apporte de plus qu'un tutoriel, et pour qui c'est vraiment utile. Affiché
// en tête du panneau Aide ; l'accueil y renvoie.

const USES: [string, string][] = [
  ["Métiers du numérique", "développement, administration système, cybersécurité, data, DevOps : le terminal est leur outil de tous les jours."],
  ["Serveurs et cloud", "les machines qui font tourner sites et applications n'ont pas d'écran ni de souris : on les pilote en commandes."],
  ["Outils incontournables", "Git, Docker, les déploiements, la plupart des outils de développeur se commandent au clavier."],
  ["Automatiser", "une ligne remplace des centaines de clics : renommer 500 fichiers, fouiller des journaux, sauvegarder chaque nuit."],
];

const PLUS: [string, string][] = [
  ["Un vrai Linux, sans risque", "il tourne dans ton navigateur : rien à installer, rien à casser sur ton ordinateur, recommence autant que tu veux."],
  ["On apprend en tapant", "chaque défi se résout avec la vraie commande, et c'est le résultat réel qui est vérifié, pas une réponse apprise par cœur."],
  ["Progressif, en français", "du premier ls jusqu'à Git, aux scripts et au réseau, palier par palier, avec des indices quand tu bloques."],
  ["Des réflexes qui restent", "le chronomètre et le mode Chaos (ton compagnon sabote ton terminal) entraînent à réagir comme face à un vrai problème."],
];

export function WhyArcade() {
  return (
    <section aria-labelledby="pourquoi" className="flex flex-col gap-5">
      <h3 id="pourquoi" className="type-label text-accent">
        Pourquoi Terminal Arcade ?
      </h3>

      <div>
        <p className="font-bold text-fg">À quoi sert le terminal</p>
        <ul className="mt-2 flex flex-col gap-2">
          {USES.map(([title, text]) => (
            <li key={title} className="text-muted">
              <span className="text-fg">{title} : </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="font-bold text-fg">Ce que le jeu apporte de plus qu&apos;un tutoriel</p>
        <ul className="mt-2 flex flex-col gap-2">
          {PLUS.map(([title, text]) => (
            <li key={title} className="text-muted">
              <span className="text-fg">{title} : </span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-l-2 border-accent pl-4">
        <p className="font-bold text-fg">Est-ce utile pour toi ?</p>
        <p className="mt-2 text-muted">
          <span className="text-fg">Oui</span> si tu étudies l&apos;informatique ou vises le développement, les
          serveurs, la cybersécurité ou la data : tu arriveras avec des réflexes que d&apos;autres prennent des mois à
          acquérir.
        </p>
        <p className="mt-2 text-muted">
          <span className="text-fg">Moins</span> si ton ordinateur ne te sert qu&apos;au web et à la bureautique : rien
          ne t&apos;oblige à passer par le terminal. Tu y gagneras quand même de la curiosité sur ce qui se passe sous le
          capot.
        </p>
        <p className="mt-2 text-muted">
          Le jeu ne remplace ni un cours ni un vrai projet : c&apos;est l&apos;entraînement qui rend les commandes
          naturelles, avant d&apos;en avoir besoin pour de vrai.
        </p>
      </div>
    </section>
  );
}
