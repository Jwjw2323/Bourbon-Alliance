import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { kindLabel, regionMeta, stores } from "@/lib/lore/catalog";
import { setHomeStore, useLore } from "@/lib/lore/state";
import type { RegionId } from "@/lib/lore/types";
import { Chip, Page } from "@/components/ui";

export const Route = createFileRoute("/stores")({
  head: () => ({ meta: [{ title: "Stores — Lore" }] }),
  component: StoresPage,
});

function StoresPage() {
  const lore = useLore();
  const [region, setRegion] = useState<RegionId | "all">("all");
  const [q, setQ] = useState("");
  const hits = useMemo(() => {
    const query = q.trim().toLowerCase();
    return stores.filter((s) => {
      if (region !== "all" && s.region !== region) return false;
      if (!query) return true;
      return `${s.name} ${s.city} ${s.address} ${s.number ?? ""}`.toLowerCase().includes(query);
    });
  }, [region, q]);

  const groups: RegionId[] = ["dc", "md", "va"];

  return (
    <Page>
      <h1 className="font-display text-3xl">Stores</h1>
      <p className="mt-2 max-w-xl text-muted">
        Inner DMV shelves hunters actually drive. Delivery days are the last published truck day, not a promise.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {(["all", "dc", "md", "va"] as const).map((id) => (
          <Chip key={id} on={region === id} onClick={() => setRegion(id)}>
            {id === "all" ? "All" : regionMeta[id].short}
          </Chip>
        ))}
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search stores"
        className="mt-3 h-11 w-full rounded-md border border-line bg-surface px-3 text-base placeholder:text-muted"
      />
      {groups.map((id) => {
        const list = hits.filter((s) => s.region === id);
        if (!list.length) return null;
        return (
          <section key={id} className="mt-8">
            <h2 className="font-display text-xl">{regionMeta[id].name}</h2>
            <p className="mt-1 text-sm text-muted">{regionMeta[id].signal}</p>
            <ul className="mt-3">
              {list.map((s) => {
                const home = lore.homeStoreId === s.id;
                return (
                  <li key={s.id} className="border-b border-line py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          to="/stores/$storeId"
                          params={{ storeId: s.id }}
                          className="text-ink underline-offset-4 hover:underline"
                        >
                          {s.name}
                        </Link>
                        <p className="text-sm text-muted">
                          {s.city}, {s.abbr} · {kindLabel[s.kind]}
                          {s.delivery ? ` · Trucks ${s.delivery}` : ""}
                          {home ? " · Home" : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="shrink-0 text-sm text-muted underline-offset-4 hover:text-ink hover:underline"
                        onClick={() => setHomeStore(home ? null : s.id)}
                      >
                        {home ? "Clear home" : "Make home"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </Page>
  );
}
