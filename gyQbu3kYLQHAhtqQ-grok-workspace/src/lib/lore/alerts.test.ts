import assert from "node:assert/strict";
import test from "node:test";
import { planAlerts, PREVIEW_HOUR } from "./alerts.ts";
import type { AlertPrefs, Bottle, Priority, Sighting, Store } from "./types.ts";

const store: Store = {
  id: "s1",
  region: "va",
  kind: "abc",
  name: "ABC 1",
  address: "1 Main",
  city: "Alexandria",
  abbr: "VA",
  hours: "10–9",
};

const other: Store = { ...store, id: "s2", region: "dc", abbr: "DC", kind: "private", name: "Shop" };

const unicorn: Bottle = {
  id: "b1",
  name: "Test Bottle",
  maker: "Test",
  tier: "unicorn",
  typical: 50,
};

const prefs: AlertPrefs = {
  regions: ["dc", "md", "va"],
  sms: true,
  email: true,
  quietStart: 21,
  quietEnd: 8,
  cooldownHours: 12,
  smsDailyCap: 3,
  corroborationForSms: true,
  freshWindowMin: 90,
};

function sight(partial: Partial<Sighting> & Pick<Sighting, "id" | "ageMin">): Sighting {
  return {
    storeId: "s1",
    bottleId: "b1",
    qty: 1,
    price: 50,
    placement: "shelf",
    source: "hunter",
    confirms: 2,
    reporter: "A",
    ...partial,
  };
}

function plan(
  sightings: Sighting[],
  over: Partial<AlertPrefs> = {},
  watch: Record<string, Priority> = { b1: "unicorn" },
) {
  return planAlerts({
    sightings,
    stores: [store, other],
    bottles: [unicorn],
    prefs: { ...prefs, ...over },
    watch,
    gone: {},
    hour: PREVIEW_HOUR,
    now: null,
  });
}

test("fresh corroborated unicorn texts", () => {
  const [row] = plan([sight({ id: "a", ageMin: 20 })]);
  assert.equal(row?.decision.channel, "sms");
});

test("one hunter emails instead of texting", () => {
  const [row] = plan([sight({ id: "a", ageMin: 20, confirms: 1 })]);
  assert.equal(row?.decision.channel, "email");
});

test("want list is a morning note", () => {
  const [row] = plan([sight({ id: "a", ageMin: 20 })], {}, { b1: "want" });
  assert.equal(row?.decision.channel, "digest");
});

test("curious never pings", () => {
  const [row] = plan([sight({ id: "a", ageMin: 10, confirms: 2 })], {}, { b1: "curious" });
  assert.equal(row?.decision.channel, "board");
});

test("stale allocated bottle skips the text", () => {
  const [row] = plan([sight({ id: "a", ageMin: 200 })]);
  assert.equal(row?.decision.channel, "digest");
});

test("quiet hours hold the text", () => {
  const [row] = plan([sight({ id: "a", ageMin: 10 })], { quietEnd: 9 });
  assert.equal(row?.decision.channel, "digest");
});

test("daily cap rolls the fourth text into the morning note", () => {
  const stores: Store[] = ["s1", "s2", "s3", "s4"].map((id) => ({ ...store, id }));
  const rows = planAlerts({
    sightings: stores.map((s, i) => sight({ id: s.id, ageMin: 10 + i, storeId: s.id })),
    stores,
    bottles: [unicorn],
    prefs,
    watch: { b1: "unicorn" },
    gone: {},
    hour: PREVIEW_HOUR,
    now: null,
  });
  const texts = rows.filter((r) => r.decision.channel === "sms");
  const rolled = rows.filter((r) => r.decision.reason.includes("Daily text cap"));
  assert.equal(texts.length, 3);
  assert.equal(rolled.length, 1);
});

test("same bottle at the same store inside cooldown is held", () => {
  const rows = plan([
    sight({ id: "new", ageMin: 20 }),
    sight({ id: "old", ageMin: 400 }),
  ]);
  const older = rows.find((r) => r.sighting.id === "old");
  assert.equal(older?.decision.channel, "drop");
  assert.match(older?.decision.reason ?? "", /cooldown/);
});

test("outside your regions is held", () => {
  const [row] = plan([sight({ id: "a", ageMin: 10, storeId: "s2" })], { regions: ["va"] });
  assert.equal(row?.decision.channel, "drop");
});
