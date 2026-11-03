import { Link } from "@tanstack/react-router";
import { bottleById, placementLabel, sourceLabel, storeById, tierLabel } from "@/lib/lore/catalog";
import { ageMinutes, formatAge, money } from "@/lib/lore/format";
import type { Sighting } from "@/lib/lore/types";
import { Button } from "@/components/ui";

export function SightingRow({
  sighting,
  now,
  freshWindowMin,
  gone,
  onConfirm,
  onGone,
}: {
  sighting: Sighting;
  now: number | null;
  freshWindowMin: number;
  gone: boolean;
  onConfirm: () => void;
  onGone: (gone: boolean) => void;
}) {
  const bottle = bottleById[sighting.bottleId];
  const store = storeById[sighting.storeId];
  if (!bottle || !store) return null;
  const mins = ageMinutes(sighting, now);
  const fresh = mins <= freshWindowMin && !gone;
  const hunters =
    sighting.source === "hunter"
      ? sighting.confirms === 1
        ? "1 hunter"
        : `${sighting.confirms} hunters`
      : "Published count";

  return (
    <article className="border-b border-line py-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-muted tabular-nums">
          {formatAge(mins)} · {sourceLabel[sighting.source]}
        </p>
        <p className="text-sm tabular-nums text-ink">{money(sighting.price)}</p>
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <h2 className="font-display text-xl text-ink">
          <Link
            to="/bottles/$bottleId"
            params={{ bottleId: bottle.id }}
            className="underline-offset-4 hover:underline"
          >
            {bottle.name}
          </Link>
        </h2>
        <span className="text-sm text-muted">{tierLabel[bottle.tier]}</span>
      </div>
      <p className="mt-1 text-sm text-ink">
        <Link
          to="/stores/$storeId"
          params={{ storeId: store.id }}
          className="underline-offset-4 hover:underline"
        >
          {store.name}
        </Link>
        <span className="text-muted">
          {" "}
          · {store.city}, {store.abbr}
        </span>
      </p>
      <p className="mt-1 text-sm text-muted">
        <span className="tabular-nums text-ink">{sighting.qty}</span>
        {" · "}
        {placementLabel[sighting.placement]}
        {" · "}
        {hunters}
        {" · "}
        {gone ? (
          <span className="text-accent">Gone</span>
        ) : fresh ? (
          <span className="text-live">Fresh</span>
        ) : (
          <span>Aging</span>
        )}
      </p>
      {sighting.note ? <p className="mt-1 text-sm text-muted">{sighting.note}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="line" disabled={gone} onClick={onConfirm}>
          I see it too
        </Button>
        {gone ? (
          <Button variant="ghost" onClick={() => onGone(false)}>
            Bring back
          </Button>
        ) : (
          <Button variant="ghost" onClick={() => onGone(true)}>
            Gone
          </Button>
        )}
      </div>
    </article>
  );
}
