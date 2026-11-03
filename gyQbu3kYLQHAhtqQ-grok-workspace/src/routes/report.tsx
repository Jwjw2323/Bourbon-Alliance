import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PREVIEW_HOUR, planAlerts } from "@/lib/lore/alerts";
import { bottleById, bottles, kindLabel, priorityLabel, stores } from "@/lib/lore/catalog";
import { money } from "@/lib/lore/format";
import { addSightings, useLore, useNow } from "@/lib/lore/state";
import type { Placement, Sighting } from "@/lib/lore/types";
import { Button, Chip, Page, fieldClass } from "@/components/ui";

export const Route = createFileRoute("/report")({
  validateSearch: (search: Record<string, unknown>) => ({
    store: typeof search.store === "string" ? search.store : "",
  }),
  head: () => ({ meta: [{ title: "Report a sighting — Lore" }] }),
  component: ReportPage,
});

type Draft = { qty: number; price: string; placement: Placement; note: string };

function ReportPage() {
  const { store: storeParam } = Route.useSearch();
  const lore = useLore();
  const now = useNow();
  const navigate = useNavigate();
  const preset = storeParam && stores.some((s) => s.id === storeParam) ? storeParam : "";
  const [step, setStep] = useState<1 | 2 | 3 | 4>(preset ? 2 : 1);
  const [storeId, setStoreId] = useState(preset);
  const [storeQuery, setStoreQuery] = useState("");
  const [bottleQuery, setBottleQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [logged, setLogged] = useState<Sighting[]>([]);

  const store = stores.find((s) => s.id === storeId);

  const storeHits = useMemo(() => {
    const q = storeQuery.trim().toLowerCase();
    return stores.filter((s) => {
      if (!q) return true;
      return `${s.name} ${s.city} ${s.address} ${s.number ?? ""}`.toLowerCase().includes(q);
    });
  }, [storeQuery]);

  const bottleHits = useMemo(() => {
    const q = bottleQuery.trim().toLowerCase();
    const list = bottles.filter((b) => {
      const watched = Boolean(lore.watch[b.id]);
      if (!q && b.tier === "shelf" && !watched) return false;
      if (!q) return true;
      return `${b.name} ${b.maker}`.toLowerCase().includes(q);
    });
    return [...list].sort((a, b) => {
      const aw = lore.watch[a.id] ? 0 : 1;
      const bw = lore.watch[b.id] ? 0 : 1;
      return aw - bw || a.name.localeCompare(b.name);
    });
  }, [bottleQuery, lore.watch]);

  function toggleBottle(id: string) {
    setPicked((curr) => {
      if (curr.includes(id)) return curr.filter((x) => x !== id);
      const bottle = bottleById[id];
      setDrafts((d) => ({
        ...d,
        [id]: d[id] ?? {
          qty: 1,
          price: bottle ? bottle.typical.toFixed(2) : "",
          placement: "shelf",
          note: "",
        },
      }));
      return [...curr, id];
    });
  }

  function submit() {
    if (!storeId || picked.length === 0) return;
    const seenAt = new Date().toISOString();
    const created: Sighting[] = picked.map((id) => {
      const draft = drafts[id] ?? { qty: 1, price: "", placement: "shelf" as const, note: "" };
      const price = Number(draft.price);
      return {
        id: crypto.randomUUID(),
        storeId,
        bottleId: id,
        qty: draft.qty,
        price: Number.isFinite(price) && draft.price.trim() !== "" ? price : null,
        placement: draft.placement,
        source: "hunter",
        ageMin: 0,
        seenAt,
        confirms: 1,
        note: draft.note.trim() || undefined,
        reporter: "You",
      };
    });
    addSightings(created);
    setLogged(created);
    setStep(4);
  }

  return (
    <Page width="narrow">
      <p className="text-sm text-muted">Step {Math.min(step, 3)} of 3</p>
      {step === 1 ? (
        <>
          <h1 className="mt-1 font-display text-3xl">Where did you see it?</h1>
          <input
            value={storeQuery}
            onChange={(e) => setStoreQuery(e.target.value)}
            placeholder="Store name, city, or number"
            className={`${fieldClass} mt-5`}
            autoFocus
          />
          <ul className="mt-3">
            {storeHits.map((s) => (
              <li key={s.id} className="border-b border-line">
                <button
                  type="button"
                  className="flex w-full flex-col items-start py-3 text-left"
                  onClick={() => {
                    setStoreId(s.id);
                    setStep(2);
                  }}
                >
                  <span className="text-ink">{s.name}</span>
                  <span className="text-sm text-muted">
                    {s.city}, {s.abbr} · {kindLabel[s.kind]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {step === 2 && store ? (
        <>
          <h1 className="mt-1 font-display text-3xl">What’s on the shelf?</h1>
          <p className="mt-2 text-sm text-muted">
            {store.name} · {store.city}. Pick every allocated bottle you can see. Skip the everyday stuff unless it is on your list.
          </p>
          <input
            value={bottleQuery}
            onChange={(e) => setBottleQuery(e.target.value)}
            placeholder="Search bottles"
            className={`${fieldClass} mt-5`}
          />
          <ul className="mt-3">
            {bottleHits.map((b) => {
              const on = picked.includes(b.id);
              const watch = lore.watch[b.id];
              return (
                <li key={b.id} className="border-b border-line">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 py-3 text-left"
                    onClick={() => toggleBottle(b.id)}
                    aria-pressed={on}
                  >
                    <span>
                      <span className="block text-ink">{b.name}</span>
                      <span className="text-sm text-muted">
                        {b.maker}
                        {watch ? ` · ${priorityLabel[watch]}` : ""}
                      </span>
                    </span>
                    <span
                      className={`grid size-6 place-items-center rounded-sm border ${on ? "border-ink bg-ink text-bg" : "border-line"}`}
                      aria-hidden="true"
                    >
                      {on ? <Check className="size-4" /> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex gap-2">
            <Button variant="line" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button disabled={picked.length === 0} onClick={() => setStep(3)}>
              {picked.length === 0 ? "Pick a bottle" : `Next · ${picked.length}`}
            </Button>
          </div>
        </>
      ) : null}

      {step === 3 && store ? (
        <>
          <h1 className="mt-1 font-display text-3xl">How many, and where?</h1>
          <p className="mt-2 text-sm text-muted">{store.name}. Price can stay blank.</p>
          <div className="mt-5 space-y-6">
            {picked.map((id) => {
              const bottle = bottleById[id];
              const draft = drafts[id];
              if (!bottle || !draft) return null;
              return (
                <fieldset key={id} className="border-b border-line pb-5">
                  <legend className="font-display text-lg">{bottle.name}</legend>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="line"
                      className="w-11 px-0"
                      onClick={() =>
                        setDrafts((d) => ({ ...d, [id]: { ...draft, qty: Math.max(1, draft.qty - 1) } }))
                      }
                      aria-label="Fewer"
                    >
                      −
                    </Button>
                    <span className="w-8 text-center tabular-nums">{draft.qty}</span>
                    <Button
                      variant="line"
                      className="w-11 px-0"
                      onClick={() =>
                        setDrafts((d) => ({ ...d, [id]: { ...draft, qty: Math.min(12, draft.qty + 1) } }))
                      }
                      aria-label="More"
                    >
                      +
                    </Button>
                    <span className="text-sm text-muted">on hand</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(["shelf", "counter", "case"] as const).map((p) => (
                      <Chip
                        key={p}
                        on={draft.placement === p}
                        onClick={() => setDrafts((d) => ({ ...d, [id]: { ...draft, placement: p } }))}
                      >
                        {p === "shelf" ? "Shelf" : p === "counter" ? "Counter" : "Case"}
                      </Chip>
                    ))}
                  </div>
                  <label className="mt-3 block text-sm text-muted">
                    Price
                    <input
                      inputMode="decimal"
                      value={draft.price}
                      onChange={(e) => setDrafts((d) => ({ ...d, [id]: { ...draft, price: e.target.value } }))}
                      className={`${fieldClass} mt-1`}
                    />
                  </label>
                  <label className="mt-3 block text-sm text-muted">
                    Note, if it matters
                    <input
                      value={draft.note}
                      maxLength={80}
                      onChange={(e) => setDrafts((d) => ({ ...d, [id]: { ...draft, note: e.target.value } }))}
                      placeholder="Limit one, ask at the counter"
                      className={`${fieldClass} mt-1`}
                    />
                  </label>
                </fieldset>
              );
            })}
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="line" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={submit}>Log it</Button>
          </div>
        </>
      ) : null}

      {step === 4 && store ? (
        <Done storeName={store.name} logged={logged} lore={lore} now={now} onBoard={() => navigate({ to: "/" })} />
      ) : null}
    </Page>
  );
}

function Done({
  storeName,
  logged,
  lore,
  now,
  onBoard,
}: {
  storeName: string;
  logged: Sighting[];
  lore: ReturnType<typeof useLore>;
  now: number | null;
  onBoard: () => void;
}) {
  const base = {
    sightings: logged,
    stores,
    bottles,
    prefs: lore.prefs,
    gone: {},
    hour: PREVIEW_HOUR,
    now,
  };
  const mine = planAlerts({ ...base, watch: lore.watch });
  const asUnicorn = planAlerts({
    ...base,
    watch: Object.fromEntries(logged.map((s) => [s.bottleId, "unicorn" as const])),
  });

  return (
    <>
      <h1 className="mt-1 font-display text-3xl">Logged at {storeName}.</h1>
      <p className="mt-2 text-muted">
        You are the first report, so a text waits for a second hunter. That is the fatigue rule doing its job.
        This preview keeps the report on this device.
      </p>
      <ul className="mt-5 space-y-4">
        {logged.map((s) => {
          const bottle = bottleById[s.bottleId];
          const yours = mine.find((r) => r.sighting.id === s.id);
          const other = asUnicorn.find((r) => r.sighting.id === s.id);
          if (!bottle || !yours || !other) return null;
          return (
            <li key={s.id} className="border-b border-line pb-4">
              <p className="font-display text-lg">{bottle.name}</p>
              <p className="text-sm text-muted tabular-nums">
                {s.qty} · {money(s.price)}
              </p>
              <p className="mt-2 text-sm">
                <span className="text-muted">You · </span>
                {yours.decision.reason}
              </p>
              <p className="mt-1 text-sm">
                <span className="text-muted">A hunter who lists it as a unicorn · </span>
                {other.decision.reason}
              </p>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={onBoard}>Back to the board</Button>
        <Link to="/alerts" className="inline-flex h-11 items-center px-2 text-sm text-ink underline-offset-4 hover:underline">
          Tune the rules
        </Link>
      </div>
    </>
  );
}
