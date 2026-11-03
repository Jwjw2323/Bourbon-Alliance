import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { bottles, priorityLabel } from "@/lib/lore/catalog";
import { ageMinutes } from "@/lib/lore/format";
import { materialize, useLore, useNow } from "@/lib/lore/state";
import type { Tier } from "@/lib/lore/types";
import { Page, fieldClass } from "@/components/ui";

export const Route = createFileRoute("/bottles")({
  head: () => ({ meta: [{ title: "Bottles — Lore" }] }),
  component: BottlesPage,
});

const groups: Array<{ tier: Tier; title: string }> = [
  { tier: "unicorn", title: "Allocated" },
  { tier: "limited", title: "Limited" },
  { tier: "shelf", title: "Shelf" },
];

function BottlesPage() {
  const lore = useLore();
  const now = useNow();
  const [q, setQ] = useState("");
  const freshCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of materialize(lore)) {
      if (lore.gone[s.id]) continue;
      if (ageMinutes(s, now) > lore.prefs.freshWindowMin) continue;
      counts[s.bottleId] = (counts[s.bottleId] ?? 0) + 1;
    }
    return counts;
  }, [lore, now]);

  const query = q.trim().toLowerCase();

  return (
    <Page>
      <h1 className="font-display text-3xl">Bottles</h1>
      <p className="mt-2 max-w-xl text-muted">
        The hunt list, not the whole whiskey catalog. Everyday bottles stay off the board unless you ask for them.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search bottles"
        className={`${fieldClass} mt-5`}
      />
      {groups.map((group) => {
        const list = bottles.filter((b) => {
          if (b.tier !== group.tier) return false;
          if (!query) return true;
          return `${b.name} ${b.maker}`.toLowerCase().includes(query);
        });
        if (!list.length) return null;
        return (
          <section key={group.tier} className="mt-8">
            <h2 className="font-display text-xl">{group.title}</h2>
            <ul className="mt-2">
              {list.map((b) => {
                const watch = lore.watch[b.id];
                const n = freshCounts[b.id] ?? 0;
                return (
                  <li key={b.id} className="border-b border-line py-3">
                    <Link
                      to="/bottles/$bottleId"
                      params={{ bottleId: b.id }}
                      className="flex items-baseline justify-between gap-3"
                    >
                      <span>
                        <span className="block text-ink">{b.name}</span>
                        <span className="text-sm text-muted">
                          {b.maker}
                          {watch ? ` · ${priorityLabel[watch]}` : ""}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm tabular-nums text-muted">
                        {n === 0 ? "Quiet" : n === 1 ? "1 fresh" : `${n} fresh`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      {query && !bottles.some((b) => `${b.name} ${b.maker}`.toLowerCase().includes(query)) ? (
        <p className="mt-6 text-muted">No bottle by that name in the hunt list.</p>
      ) : null}
    </Page>
  );
}
