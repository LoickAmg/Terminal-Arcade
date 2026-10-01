"use client";

import { useEffect, useRef, useState } from "react";
import type { PetConfig } from "@/lib/pet";
import type { PetReaction } from "@/lib/game";
import { PetSprite, type PetMood } from "./PetSprite";

// Le compagnon se promène sur le bord supérieur du terminal. En mode
// normal ses réactions sont sincères ; le mode Chaos (phase 3) les rendra
// trompeuses.

const PET_WIDTH = 56;
const WALK_SPEED = 70; // px par seconde
const SLEEP_AFTER_MS = 45_000;

const LINES: Record<PetReaction, string[]> = {
  happy: ["Bien vu !", "Propre.", "Exact.", "Ça, c'est fait."],
  sad: ["Hmm… non.", "Pas ça.", "Relis bien.", "Presque ?"],
  cheer: ["Niveau hacké !", "Trop fort.", "On enchaîne ?"],
  think: ["Tu cherches ?", "help, peut-être ?", "Hmm…"],
  alarm: ["Le temps file !", "Vite !", "Ça devient serré."],
};

const MOODS: Record<PetReaction, PetMood> = {
  happy: "happy",
  sad: "sad",
  cheer: "cheer",
  think: "think",
  alarm: "think",
};

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function Pet({
  config,
  reaction,
  activity,
}: {
  config: PetConfig;
  // Change d'identifiant à chaque nouvelle réaction, même identique.
  reaction: { kind: PetReaction; id: number } | null;
  // Horodatage de la dernière action du joueur (réveille le compagnon).
  activity: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [x, setX] = useState(24);
  const xRef = useRef(24);
  const [walkMs, setWalkMs] = useState(0);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [frame, setFrame] = useState<0 | 1>(0);
  // Identifiant de la dernière réaction terminée, et valeur d'activité au
  // moment où il s'est endormi : l'humeur affichée en découle.
  const [doneReaction, setDoneReaction] = useState<number | null>(null);
  const [asleepAt, setAsleepAt] = useState<number | null>(null);
  const busyUntil = useRef(0);
  // Largeur de la piste, suivie pour que le compagnon reste dans le cadre
  // quand la fenêtre change de taille.
  const [trackWidth, setTrackWidth] = useState<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => setTrackWidth(track.clientWidth));
    observer.observe(track);
    return () => observer.disconnect();
  }, []);
  const shownX = trackWidth === null ? x : Math.max(0, Math.min(x, trackWidth - PET_WIDTH));

  const live = reaction && reaction.id !== doneReaction ? reaction : null;
  const asleep = asleepAt === activity;
  const mood: PetMood = live ? MOODS[live.kind] : asleep ? "sleep" : "idle";
  const bubble = live ? LINES[live.kind][live.id % LINES[live.kind].length] : null;
  const anim = live ? (live.kind === "sad" || live.kind === "alarm" ? "shake" : live.kind === "think" ? null : "jump") : null;

  // Réactions aux réponses du joueur : affichées 1,8 s.
  useEffect(() => {
    if (!reaction) return;
    busyUntil.current = Date.now() + 1800;
    const t = setTimeout(() => setDoneReaction(reaction.id), 1800);
    return () => clearTimeout(t);
  }, [reaction]);

  // Sommeil après un moment sans action ; la prochaine action le réveille.
  useEffect(() => {
    const t = setTimeout(() => {
      setAsleepAt(activity);
      setWalkMs(0);
    }, SLEEP_AFTER_MS);
    return () => clearTimeout(t);
  }, [activity]);

  // Promenade : de temps en temps, une nouvelle destination au hasard.
  useEffect(() => {
    if (reduced) return;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      const track = trackRef.current;
      const asleep = Date.now() - activity > SLEEP_AFTER_MS;
      if (track && !asleep && Date.now() > busyUntil.current && Math.random() < 0.65) {
        const max = Math.max(0, track.clientWidth - PET_WIDTH);
        const current = Math.min(xRef.current, max);
        const target = Math.round(Math.random() * max);
        xRef.current = target;
        setFacing(target >= current ? 1 : -1);
        setWalkMs((Math.abs(target - current) / WALK_SPEED) * 1000);
        setX(target);
      }
      timer = setTimeout(step, 2500 + Math.random() * 4000);
    };
    timer = setTimeout(step, 1500);
    return () => clearTimeout(timer);
  }, [reduced, activity]);

  // Pas de marche tant qu'il se déplace.
  useEffect(() => {
    if (walkMs === 0) return;
    const legs = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), 180);
    const stop = setTimeout(() => {
      setWalkMs(0);
      setFrame(0);
    }, walkMs);
    return () => {
      clearInterval(legs);
      clearTimeout(stop);
    };
  }, [walkMs]);

  return (
    <div ref={trackRef} className="pointer-events-none absolute inset-x-3 bottom-full h-0" aria-hidden>
      <div
        className="absolute bottom-0"
        style={{
          transform: `translateX(${shownX}px)`,
          transition: reduced ? undefined : `transform ${walkMs}ms linear`,
        }}
      >
        {bubble && (
          <div className="pet-bubble absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap">
            {bubble}
          </div>
        )}
        {mood === "sleep" && !bubble && (
          <div className="absolute -top-3 right-0 font-mono text-xs font-bold text-white">z z</div>
        )}
        <div
          className={anim === "jump" ? "pet-jump" : anim === "shake" ? "pet-shake" : undefined}
          style={{ transform: `scaleX(${facing})` }}
        >
          <PetSprite config={config} mood={mood} frame={frame} size={PET_WIDTH} />
        </div>
      </div>
    </div>
  );
}
