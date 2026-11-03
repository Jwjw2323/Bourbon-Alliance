import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/ui";

export const Route = createFileRoute("/how")({
  head: () => ({ meta: [{ title: "How Lore works" }] }),
  component: HowPage,
});

function HowPage() {
  return (
    <Page>
      <h1 className="font-display text-3xl">How Lore works</h1>
      <div className="mt-4 space-y-4 text-ink">
        <p>
          The thing worth knowing is not the agency spreadsheet. It is what a hunter saw after the doors opened.
          Allocated bottles are gone before the next published count. Lore is that gap.
        </p>
        <h2 className="pt-2 font-display text-xl">Two signals, one board</h2>
        <p>
          <span className="font-medium">Hunters</span> report a store, the bottles, a count, and whether it is on the shelf, behind the counter, or in the case.
          <span className="font-medium"> Virginia ABC</span> and <span className="font-medium">Montgomery County ABS</span> add a published count when they post one.
          A published count is a head start. It is not live once the store is open.
        </p>
        <h2 className="pt-2 font-display text-xl">Three regions, one hunt</h2>
        <p>
          DC has no control board, so sightings are the whole signal. Montgomery County is a control system; the rest of Maryland is private retail and comes in as its own plug-in.
          Virginia is ABC stock plus hunters, because the truck-day count lies by 10:15 a.m.
        </p>
        <h2 className="pt-2 font-display text-xl">Alerts that stay quiet</h2>
        <p>
          Unicorn can text you. Want rides the morning note. Curious stays on the board. A text also has to clear a fresh window, your regions, quiet hours, a per-store cooldown, a daily cap, and — unless you turn it off — a second hunter or a published count.
          One Blanton’s does not wake twelve people four times.
        </p>
        <p>
          Nothing here is a promise the bottle is still there. Call the store. Lore is not Virginia ABC, Montgomery County, or any shop.
        </p>
        <p className="text-muted">
          This preview is the hunt itself: the board, the three-step report, and the rules. Accounts, real texts, and the agency workers are the next layer, once the rules feel right.
        </p>
      </div>
      <p className="mt-6">
        <Link to="/alerts" className="text-sm text-ink underline-offset-4 hover:underline">
          Tune your rules
        </Link>
      </p>
    </Page>
  );
}
