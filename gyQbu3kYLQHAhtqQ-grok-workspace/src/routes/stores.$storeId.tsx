import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { kindLabel, storeById } from "@/lib/lore/catalog";
import { ageMinutes } from "@/lib/lore/format";
import { confirmSighting, markGone, materialize, setHomeStore, useLore, useNow } from "@/lib/lore/state";
import { SightingRow } from "@/components/sighting-row";
import { Button, Page } from "@/components/ui";

export const Route = createFileRoute("/stores/$storeId")({
  head: () => ({ meta: [{ title: "Store — Lore" }] }),
  component: StorePage,
});

function StorePage() {
  const { storeId } = Route.useParams();
  const store = storeById[storeId];
  const lore = useLore();
  const now = useNow();
  const navigate = useNavigate();
  if (!store) {
    return (
      <Page>
        <h1 className="font-display text-3xl">Store not on the board</h1>
        <Link to="/stores" className="mt-4 inline-block text-sm underline-offset-4 hover:underline">
          All stores
        </Link>
      </Page>
    );
  }
  const rows = materialize(lore)
    .filter((s) => s.storeId === store.id)
    .sort((a, b) => ageMinutes(a, now) - ageMinutes(b, now));
  const home = lore.homeStoreId === store.id;

  return (
    <Page>
      <p className="text-sm text-muted">
        {kindLabel[store.kind]} · {store.city}, {store.abbr}
      </p>
      <h1 className="mt-1 font-display text-3xl">{store.name}</h1>
      <p className="mt-2 text-ink">{store.address}</p>
      <dl className="mt-4 space-y-1 text-sm">
        {store.district ? (
          <div className="flex gap-2">
            <dt className="text-muted">District</dt>
            <dd>{store.district}</dd>
          </div>
        ) : null}
        {store.delivery ? (
          <div className="flex gap-2">
            <dt className="text-muted">Truck day</dt>
            <dd>{store.delivery}</dd>
          </div>
        ) : null}
        <div className="flex gap-2">
          <dt className="text-muted">Hours</dt>
          <dd>{store.hours}</dd>
        </div>
        {store.phone ? (
          <div className="flex gap-2">
            <dt className="text-muted">Phone</dt>
            <dd>
              <a className="underline-offset-4 hover:underline" href={`tel:${store.phone.replace(/[^\d+]/g, "")}`}>
                {store.phone}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={() => navigate({ to: "/report", search: { store: store.id } })}>
          Report this store
        </Button>
        <Button variant="line" onClick={() => setHomeStore(home ? null : store.id)}>
          {home ? "Clear home store" : "Make this home"}
        </Button>
      </div>
      <h2 className="mt-8 font-display text-xl">On the board</h2>
      {rows.length === 0 ? (
        <p className="mt-2 text-muted">Nothing reported here yet.</p>
      ) : (
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
