import { createFileRoute, Link } from "@tanstack/react-router";
import { PREVIEW_HOUR, planAlerts } from "@/lib/lore/alerts";
import { bottleById, bottles, priorityHint, priorityLabel, stores, tierLabel } from "@/lib/lore/catalog";
import { ageMinutes, money } from "@/lib/lore/format";
import {
  confirmSighting,
  markGone,
  materialize,
  setWatch,
  useLore,
  useNow,
} from "@/lib/lore/state";
import type { Priority } from "@/lib/lore/types";
import { SightingRow } from "@/components/sighting-row";
import { Page } from "@/components/ui";

export const Route = createFileRoute("/bottles/$bottleId")({
  head: () => ({ meta: [{ title: "Bottle — Lore" }] }),
  component: BottlePage,
});

const priorities: Priority[] = ["unicorn", "want", "curious"];

function BottlePage() {
  const { bottleId } = Route.useParams();
  const bottle = bottleById[bottleId];
  const lore = useLore();
  const now = useNow();
  if (!bottle) {
    return (
      <Page>
        <h1 className="font-display text-3xl">Not in the hunt list</h1>
        <Link to="/bottles" className="mt-4 inline-block text-sm underline-offset-4 hover:underline">
          All bottles
        </Link>
      </Page>
    );
  }

  const rows = materialize(lore)
    .filter((s) => s.bottleId === bottle.id)
    .sort((a, b) => ageMinutes(a, now) - ageMinutes(b, now));
  const latest = rows.find((s) => !lore.gone[s.id]) ?? rows[0];
  const watch = lore.watch[bottle.id];

  const real = latest
    ? planAlerts({
        sightings: materialize(lore),
        stores,
        bottles,
        prefs: lore.prefs,
        watch: lore.watch,
        gone: lore.gone,
        hour: PREVIEW_HOUR,
        now,
      }).find((r) => r.sighting.id === latest.id)
    : undefined;

  const asUnicorn = latest
    ? planAlerts({
        sightings: materialize(lore),
        stores,
        bottles,
        prefs: lore.prefs,
        watch: { ...lore.watch, [bottle.id]: "unicorn" },
        gone: lore.gone,
        hour: PREVIEW_HOUR,
        now,
      }).find((r) => r.sighting.id === latest.id)
    : undefined;

  return (
    <Page>
      <p className="text-sm text-muted">
        {bottle.maker} · {tierLabel[bottle.tier]} · typical shelf {money(bottle.typical)}
      </p>
      <h1 className="mt-1 font-display text-3xl">{bottle.name}</h1>

      <div className="mt-5">
        <p className="text-sm text-muted">Your list</p>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-line p-1">
          {priorities.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setWatch(bottle.id, watch === p ? null : p)}
              className={`h-11 rounded text-sm ${watch === p ? "bg-ink text-bg" : "text-muted"}`}
            >
              {priorityLabel[p]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">
          {watch ? priorityHint[watch] : "Not on your list. A lower priority never gets a louder channel."}
        </p>
      </div>

      {latest && real ? (
        <p className="mt-5 text-sm">
          {watch ? (
            <>
              <span className="text-muted">Latest sighting under your rules · </span>
              {real.decision.reason}
            </>
          ) : (
            <>
              <span className="text-muted">Not on your list. As a unicorn · </span>
              {asUnicorn?.decision.reason}
            </>
          )}
        </p>
      ) : (
        <p className="mt-5 text-sm text-muted">Nothing reported for this bottle yet.</p>
      )}

      <h2 className="mt-8 font-display text-xl">Sightings</h2>
      {rows.length === 0 ? null : (
        rows.map((s) => (
          <SightingRow
            key={s.id}
            sighting={s}
            now={now}
            freshWindowMin={lore.prefs.freshWindowMin}
            gone={Boolean(lore.gone[s.id])}
            onConfirm={() => confirmSighting(s.id)}
            onGone={(g) => markGone(s.id, g)}
          />
        ))
      )}
    </Page>
  );
}
