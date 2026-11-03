import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PREVIEW_CLOCK, PREVIEW_HOUR, planAlerts } from "@/lib/lore/alerts";
import { bottleById, bottles, priorityHint, priorityLabel, regionMeta, stores } from "@/lib/lore/catalog";
import { hourLabel } from "@/lib/lore/format";
import { materialize, resetDevice, setPrefs, setWatch, useLore, useNow } from "@/lib/lore/state";
import type { Channel, Priority, RegionId } from "@/lib/lore/types";
import { Button, Page } from "@/components/ui";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts — Lore" }] }),
  component: AlertsPage,
});

const channelName: Record<Channel, string> = {
  sms: "Text",
  email: "Email",
  digest: "Morning note",
  board: "Board only",
  drop: "Held",
};

const priorities: Priority[] = ["unicorn", "want", "curious"];

function AlertsPage() {
  const lore = useLore();
  const now = useNow();
  const [addId, setAddId] = useState("");
  const planned = useMemo(
    () =>
      planAlerts({
        sightings: materialize(lore),
        stores,
        bottles,
        prefs: lore.prefs,
        watch: lore.watch,
        gone: lore.gone,
        hour: PREVIEW_HOUR,
        now,
      }),
    [lore, now],
  );

  const watched = planned.filter((row) => lore.watch[row.bottle.id]);
  const ignored = planned.length - watched.length;
  const counts = watched.reduce(
    (acc, row) => {
      acc[row.decision.channel] += 1;
      return acc;
    },
    { sms: 0, email: 0, digest: 0, board: 0, drop: 0 } as Record<Channel, number>,
  );

  const ordered = [...watched].sort((a, b) => {
    const rank: Record<Channel, number> = { sms: 0, email: 1, digest: 2, board: 3, drop: 4 };
    return rank[a.decision.channel] - rank[b.decision.channel];
  });

  const unwatched = bottles.filter((b) => !lore.watch[b.id]);

  function toggleRegion(id: RegionId) {
    const has = lore.prefs.regions.includes(id);
    const regions = has ? lore.prefs.regions.filter((r) => r !== id) : [...lore.prefs.regions, id];
    setPrefs({ ...lore.prefs, regions });
  }

  return (
    <Page>
      <h1 className="font-display text-3xl">Alerts</h1>
      <p className="mt-2 max-w-xl text-muted">
        Priority sets the loudest channel. The gates below can only make a ping quieter. A curious bottle never becomes a text.
      </p>
      <p className="mt-2 text-sm text-muted">
        Scored as of {PREVIEW_CLOCK}, just after quiet hours, so you can see a morning board. This preview does not send texts or email.
      </p>

      <section className="mt-8">
        <h2 className="font-display text-xl">Your list</h2>
        <ul className="mt-3">
          {Object.entries(lore.watch).map(([id, priority]) => {
            const bottle = bottleById[id];
            if (!bottle) return null;
            return (
              <li key={id} className="border-b border-line py-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-ink">{bottle.name}</p>
                  <button
                    type="button"
                    className="text-sm text-muted underline-offset-4 hover:underline"
                    onClick={() => setWatch(id, null)}
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg border border-line p-1">
                  {priorities.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setWatch(id, p)}
                      className={`h-10 rounded text-sm ${priority === p ? "bg-ink text-bg" : "text-muted"}`}
                    >
                      {priorityLabel[p]}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted">{priorityHint[priority]}</p>
              </li>
            );
          })}
        </ul>
        <div className="mt-3 flex gap-2">
          <select
            value={addId}
            onChange={(e) => setAddId(e.target.value)}
            className="h-11 min-w-0 flex-1 rounded-md border border-line bg-surface px-3 text-sm"
          >
            <option value="">Add a bottle</option>
            {unwatched.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <Button
            variant="line"
            disabled={!addId}
            onClick={() => {
              if (!addId) return;
              setWatch(addId, "want");
              setAddId("");
            }}
          >
            Add
          </Button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl">Gates</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {(["dc", "md", "va"] as const).map((id) => {
            const on = lore.prefs.regions.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleRegion(id)}
                className={`h-9 rounded-full border px-3 text-sm ${on ? "border-ink bg-ink text-bg" : "border-line text-muted"}`}
              >
                {regionMeta[id].short}
              </button>
            );
          })}
        </div>

        <div className="mt-4 space-y-3">
          <Toggle
            label="Texts"
            hint="Only unicorns, and only if the other gates pass."
            on={lore.prefs.sms}
            onClick={() => setPrefs({ ...lore.prefs, sms: !lore.prefs.sms })}
          />
          <Toggle
            label="Email and morning note"
            hint="The quieter channel. Also where held texts go."
            on={lore.prefs.email}
            onClick={() => setPrefs({ ...lore.prefs, email: !lore.prefs.email })}
          />
          <Toggle
            label="Second hunter before a text"
            hint="A published ABC or ABS count counts as the second source."
            on={lore.prefs.corroborationForSms}
            onClick={() =>
              setPrefs({ ...lore.prefs, corroborationForSms: !lore.prefs.corroborationForSms })
            }
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-muted">
            Quiet from
            <select
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-ink"
              value={lore.prefs.quietStart}
              onChange={(e) => setPrefs({ ...lore.prefs, quietStart: Number(e.target.value) })}
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-muted">
            Quiet until
            <select
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-ink"
              value={lore.prefs.quietEnd}
              onChange={(e) => setPrefs({ ...lore.prefs, quietEnd: Number(e.target.value) })}
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Choice
          label="Cooldown"
          value={lore.prefs.cooldownHours}
          options={[
            [6, "6h"],
            [12, "12h"],
            [24, "24h"],
          ]}
          onChange={(n) => setPrefs({ ...lore.prefs, cooldownHours: n })}
        />
        <Choice
          label="Texts per day"
          value={lore.prefs.smsDailyCap}
          options={[
            [1, "1"],
            [3, "3"],
            [5, "5"],
          ]}
          onChange={(n) => setPrefs({ ...lore.prefs, smsDailyCap: n })}
        />
        <Choice
          label="Fresh window"
          value={lore.prefs.freshWindowMin}
          options={[
            [45, "45m"],
            [90, "90m"],
            [180, "3h"],
          ]}
          onChange={(n) => setPrefs({ ...lore.prefs, freshWindowMin: n })}
        />
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl">This morning</h2>
        <p className="mt-2 text-sm tabular-nums text-muted">
          {counts.sms} texts · {counts.email} emails · {counts.digest} morning notes · {counts.board} on the board · {counts.drop} held
        </p>
        <p className="mt-1 text-sm text-muted">
          {ignored} other sightings are not on your list, so they never leave the board.
        </p>
        <ul className="mt-3">
          {ordered.map((row) => (
            <li key={row.sighting.id} className="border-b border-line py-3">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-ink">{row.bottle.name}</p>
                <p className={row.decision.channel === "sms" ? "text-sm text-live" : "text-sm text-muted"}>
                  {channelName[row.decision.channel]}
                </p>
              </div>
              <p className="text-sm text-muted">
                {row.store.name} · {row.store.city}
              </p>
              <p className="mt-1 text-sm">{row.decision.reason}</p>
            </li>
          ))}
        </ul>
      </section>

      <button
        type="button"
        className="mt-8 text-sm text-muted underline-offset-4 hover:underline"
        onClick={() => resetDevice()}
      >
        Reset this device
      </button>
    </Page>
  );
}

const hours = Array.from({ length: 24 }, (_, i) => i);

function Toggle({
  label,
  hint,
  on,
  onClick,
}: {
  label: string;
  hint: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} className="flex w-full items-start justify-between gap-4 text-left">
      <span>
        <span className="block text-sm text-ink">{label}</span>
        <span className="block text-sm text-muted">{hint}</span>
      </span>
      <span className={`mt-1 h-6 w-11 shrink-0 rounded-full p-0.5 ${on ? "bg-ink" : "bg-line"}`} aria-hidden="true">
        <span className={`block size-5 rounded-full bg-surface ${on ? "ml-auto" : ""}`} />
      </span>
      <span className="sr-only">{on ? "On" : "Off"}</span>
    </button>
  );
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: number;
  options: Array<[number, string]>;
  onChange: (n: number) => void;
}) {
  return (
    <div className="mt-4">
      <p className="text-sm text-muted">{label}</p>
      <div className="mt-1 grid grid-cols-3 gap-1 rounded-lg border border-line p-1">
        {options.map(([n, text]) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`h-10 rounded text-sm tabular-nums ${value === n ? "bg-ink text-bg" : "text-muted"}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
