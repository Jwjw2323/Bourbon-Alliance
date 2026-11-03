import type { Sighting } from "@/lib/lore/types";

export function ageMinutes(s: Pick<Sighting, "ageMin" | "seenAt">, now: number | null): number {
  if (s.seenAt && now != null) {
    const t = Date.parse(s.seenAt);
    if (!Number.isNaN(t)) return Math.max(0, Math.round((now - t) / 60_000));
  }
  return s.ageMin;
}

export function formatAge(mins: number): string {
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

export function money(n: number | null): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function hourLabel(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const suffix = h < 12 ? "a.m." : "p.m.";
  const n = h % 12 === 0 ? 12 : h % 12;
  return `${n} ${suffix}`;
}
