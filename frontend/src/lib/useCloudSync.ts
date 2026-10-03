"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EMPTY_PROGRESS, type Progress } from "@terminal-arcade/shared";
import { pushSave, type CloudSave } from "./cloud";
import { DEFAULT_PET, isPetConfig } from "./pet";
import { SAVE_EVENT, isObject, load, save } from "./storage";
import { DEFAULT_SETTINGS, isSettings } from "./themes";

// Synchronisation de la sauvegarde locale avec le compte :
// - à la connexion, on envoie la sauvegarde locale ; le serveur la fusionne
//   avec la sienne et renvoie le résultat, qui remplace la copie locale ;
// - ensuite, chaque sauvegarde locale est envoyée après 4 s de calme ;
// - au retour du réseau, on renvoie ce qui a pu être manqué.

export type SyncState = "off" | "syncing" | "synced" | "error";

const KEYS = new Set(["progress", "pet", "settings"]);
const DEBOUNCE = 4000;

const isProgress = (v: unknown): v is Progress => isObject(v) && isObject(v.levels) && isObject(v.xpByTree);

function readLocal(): CloudSave {
  return {
    progress: load("progress", EMPTY_PROGRESS, isProgress),
    pet: load("pet", DEFAULT_PET, isPetConfig),
    settings: load("settings", DEFAULT_SETTINGS, isSettings),
  };
}

export function useCloudSync(userId: string | null, onMerged: (save: CloudSave) => void) {
  const [state, setState] = useState<SyncState>("off");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const merged = useRef(onMerged);
  useEffect(() => {
    merged.current = onMerged;
  });

  const push = useCallback(async (adopt: boolean) => {
    setState("syncing");
    try {
      const result = await pushSave(readLocal());
      if (adopt) {
        // Écriture silencieuse : elle ne doit pas relancer une synchronisation.
        save("progress", result.progress, { silent: true });
        if (result.pet) save("pet", result.pet, { silent: true });
        if (result.settings) save("settings", result.settings, { silent: true });
        merged.current(result);
      }
      setState("synced");
      setError("");
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "Synchronisation impossible.");
    }
  }, []);

  // Connexion (ou rechargement de la page en étant connecté) : fusion complète.
  useEffect(() => {
    if (!userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reflète la déconnexion
      setState("off");
      return;
    }
    void push(true);
  }, [userId, push]);

  // Sauvegardes locales suivantes : envoi groupé après un moment de calme.
  useEffect(() => {
    if (!userId) return;
    const onSave = (e: Event) => {
      if (!KEYS.has((e as CustomEvent<string>).detail)) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void push(false), DEBOUNCE);
    };
    const onOnline = () => void push(false);
    window.addEventListener(SAVE_EVENT, onSave);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener(SAVE_EVENT, onSave);
      window.removeEventListener("online", onOnline);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [userId, push]);

  return { state, error, syncNow: () => push(true) };
}
