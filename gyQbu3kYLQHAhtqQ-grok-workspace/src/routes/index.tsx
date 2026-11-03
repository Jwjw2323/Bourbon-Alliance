import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { bottleById, regionMeta, storeById } from "@/lib/lore/catalog";
import { ageMinutes } from "@/lib/lore/format";
import { confirmSighting, markGone, materialize, useLore, useNow } from "@/lib/lore/state";
import type { RegionId } from "@/lib/lore/types";
import { SightingRow } from "@/components/sighting-row";
import { Chip, Page } from "@/components/ui";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "The board — Lore" }] }),
  component: Board,
});

const regions: Array<RegionId | "all"> = ["all", "dc", "md", "va"];

function Board() {
  const lore = useLore();
  const now = useNow();
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [mine, setMine] = useState(false);
  const [freshOnly, setFreshOnly] = useState(false);
  const [showGone, setShowGone] = useState(false);
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return materialize(lore)
      .filter((s) => {
        const store = storeById[s.storeId];
        if (!store) return false;
        if (region !== "all" && store.region !== region) return false;
        if (mine && !lore.watch[s.bottleId]) return false;
        if (!showGone && lore.gone[s.id]) return false;
        if (freshOnly && (lore.gone[s.id] || ageMinutes(s, now) > lore.prefs.freshWindowMin)) return false;
        if (!query) return true;
        const bottle = bottleById[s.bottleId];
        const blob = `${store.name} ${store.city} ${store.number ?? ""} ${bottle?.name ?? ""} ${bottle?.maker ?? ""}`.toLowerCase();
        return blob.includes(query);
      })
      .sort((a, b) => ageMinutes(a, now) - ageMinutes(b, now));
  }, [lore, region, mine, freshOnly, showGone, q, now]);

  const home = lore.homeStoreId ? storeById[lore.homeStoreId] : undefined;

  return (
    <Page>
      <p className="text-sm text-muted">DC · Maryland · Virginia</p>
      <h1 className="mt-1 font-display text-3xl text-ink">The board</h1>
      <p className="mt-2 max-w-xl text-muted">
        Hunters report what is actually on the shelf. Virginia ABC and Montgomery County counts show up when
        those agencies publish them. Sample shelf, real stores — not today’s inventory.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {regions.map((id) => (
          <Chip key={id} on={region === id} onClick={() => setRegion(id)}>
            {id === "all" ? "All" : regionMeta[id].short}
          </Chip>
        ))}
        <Chip on={mine} onClick={() => setMine((v) => !v)}>
          My list
        </Chip>
        <Chip on={freshOnly} onClick={() => setFreshOnly((v) => !v)}>
          Fresh
        </Chip>
        <Chip on={showGone} onClick={() => setShowGone((v) => !v)}>
          Show gone
        </Chip>
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Search the board</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a bottle or store"
          className="h-11 w-full rounded-md border border-line bg-surface px-3 text-base text-ink placeholder:text-muted"
        />
      </label>

      <p className="mt-4 text-sm text-muted tabular-nums">
        {rows.length} on the board
        {home ? (
          <>
            {" "}
            · Home store {home.name}
          </>
        ) : (
          <>
            {" "}
            · <Link to="/stores" className="text-ink underline-offset-4 hover:underline">Set a home store</Link>
          </>
        )}
      </p>

      {rows.length === 0 ? (
        <p className="mt-8 text-muted">
          Nothing matches. Clear a filter, or report what you just saw.
        </p>
      ) : (
        <div className="mt-2">
          {rows.map((s) => (
            <SightingRow
              key={s.id}
              sighting={s}
              now={now}
              freshWindowMin={lore.prefs.freshWindowMin}
              gone={Boolean(lore.gone[s.id])}
              onConfirm={() => confirmSighting(s.id)}
              onGone={(g) => markGone(s.id, g)}
            />
          ))}
        </div>
      )}
    </Page>
  );
}
