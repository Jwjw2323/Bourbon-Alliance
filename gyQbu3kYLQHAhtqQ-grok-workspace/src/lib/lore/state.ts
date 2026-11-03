import { useEffect, useState, useSyncExternalStore } from "react";
import { bottleById, seedSightings, storeById } from "@/lib/lore/catalog";
import type { AlertPrefs, Priority, RegionId, Sighting } from "@/lib/lore/types";

const KEY = "lore-board-v1";

export const defaultPrefs: AlertPrefs = {
  regions: ["dc", "md", "va"],
  sms: true,
  email: true,
  quietStart: 21,
  quietEnd: 8,
  cooldownHours: 12,
  smsDailyCap: 3,
  corroborationForSms: true,
  freshWindowMin: 90,
};

export const defaultWatch: Record<string, Priority> = {
  blantons: "unicorn",
  "eht-sb": "unicorn",
  "weller-107": "unicorn",
  stagg: "unicorn",
  "of-birthday": "unicorn",
  "pappy-15": "unicorn",
  eagle: "want",
  "weller-sr": "want",
  bt: "curious",
};

export type Persisted = {
  extras: Sighting[];
  confirmBoost: Record<string, number>;
  gone: Record<string, true>;
  watch: Record<string, Priority>;
  prefs: AlertPrefs;
  homeStoreId: string | null;
};

const REGIONS: RegionId[] = ["dc", "md", "va"];

function makeDefault(): Persisted {
  return {
    extras: [],
    confirmBoost: {},
    gone: {},
    watch: { ...defaultWatch },
    prefs: { ...defaultPrefs, regions: [...defaultPrefs.regions] },
    homeStoreId: null,
  };
}

const serverState: Persisted = makeDefault();

let clientState: Persisted | null = null;
const listeners = new Set<() => void>();

function isPriority(v: unknown): v is Priority {
  return v === "unicorn" || v === "want" || v === "curious";
}

function isRegion(v: unknown): v is RegionId {
  return v === "dc" || v === "md" || v === "va";
}

function sanitize(raw: unknown): Persisted | null {
  if (!raw || typeof raw !== "object") return null;
  const base = makeDefault();
  const data = raw as Partial<Persisted>;
  const watch: Record<string, Priority> = {};
  if (data.watch && typeof data.watch === "object") {
    for (const [id, priority] of Object.entries(data.watch)) {
      if (isPriority(priority) && bottleById[id]) watch[id] = priority;
    }
  }
  const regions = Array.isArray(data.prefs?.regions)
    ? data.prefs.regions.filter(isRegion)
    : base.prefs.regions;
  const prefs: AlertPrefs = {
    ...base.prefs,
    ...(data.prefs ?? {}),
    regions: regions.length ? [...new Set(regions)] : [],
  };
  prefs.quietStart = clampHour(prefs.quietStart);
  prefs.quietEnd = clampHour(prefs.quietEnd);
  prefs.cooldownHours = [6, 12, 24].includes(prefs.cooldownHours) ? prefs.cooldownHours : 12;
  prefs.smsDailyCap = [1, 3, 5].includes(prefs.smsDailyCap) ? prefs.smsDailyCap : 3;
  prefs.freshWindowMin = [45, 90, 180].includes(prefs.freshWindowMin) ? prefs.freshWindowMin : 90;
  prefs.sms = Boolean(prefs.sms);
  prefs.email = Boolean(prefs.email);
  prefs.corroborationForSms = Boolean(prefs.corroborationForSms);

  const extras = Array.isArray(data.extras) ? data.extras.filter(isSighting) : [];
  const gone: Record<string, true> = {};
  if (data.gone && typeof data.gone === "object") {
    for (const [id, on] of Object.entries(data.gone)) {
      if (on) gone[id] = true;
    }
  }
  const confirmBoost: Record<string, number> = {};
  if (data.confirmBoost && typeof data.confirmBoost === "object") {
    for (const [id, n] of Object.entries(data.confirmBoost)) {
      if (typeof n === "number" && n > 0 && n < 20) confirmBoost[id] = Math.round(n);
    }
  }
  const home = typeof data.homeStoreId === "string" && storeById[data.homeStoreId] ? data.homeStoreId : null;
  return { extras, confirmBoost, gone, watch, prefs, homeStoreId: home };
}

function isSighting(v: unknown): v is Sighting {
  if (!v || typeof v !== "object") return false;
  const s = v as Sighting;
  return typeof s.id === "string" && typeof s.storeId === "string" && typeof s.bottleId === "string";
}

function clampHour(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(23, Math.max(0, Math.round(n)));
}

function readStorage(): Persisted | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return sanitize(JSON.parse(raw));
  } catch {
    return null;
  }
}

function getClientSnapshot(): Persisted {
  if (!clientState) clientState = readStorage() ?? serverState;
  return clientState;
}

function getServerSnapshot(): Persisted {
  return serverState;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(next: Persisted) {
  clientState = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  for (const listener of listeners) listener();
}

function patch(mut: (current: Persisted) => Persisted) {
  commit(mut(getClientSnapshot()));
}

export function useLore(): Persisted {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

export function useNow(): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
  }, []);
  return now;
}

export function materialize(p: Persisted): Sighting[] {
  const boosted = (s: Sighting): Sighting => {
    const extra = p.confirmBoost[s.id] ?? 0;
    return extra ? { ...s, confirms: s.confirms + extra } : s;
  };
  return [...p.extras.map(boosted), ...seedSightings.map(boosted)];
}

export function addSightings(rows: Sighting[]) {
  patch((p) => ({ ...p, extras: [...rows, ...p.extras] }));
}

export function confirmSighting(id: string) {
  patch((p) => {
    if (p.gone[id]) return p;
    return { ...p, confirmBoost: { ...p.confirmBoost, [id]: (p.confirmBoost[id] ?? 0) + 1 } };
  });
}

export function markGone(id: string, gone: boolean) {
  patch((p) => {
    const next = { ...p.gone };
    if (gone) next[id] = true;
    else delete next[id];
    return { ...p, gone: next };
  });
}

export function setWatch(bottleId: string, priority: Priority | null) {
  patch((p) => {
    const watch = { ...p.watch };
    if (priority) watch[bottleId] = priority;
    else delete watch[bottleId];
    return { ...p, watch };
  });
}

export function setPrefs(prefs: AlertPrefs) {
  const regions = prefs.regions.filter((r) => REGIONS.includes(r));
  patch((p) => ({ ...p, prefs: { ...prefs, regions } }));
}

export function setHomeStore(id: string | null) {
  patch((p) => ({ ...p, homeStoreId: id && storeById[id] ? id : null }));
}

export function resetDevice() {
  commit(makeDefault());
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
