import { i as money, t as ageMinutes } from "./format-14yrVs4e.mjs";
import { n as planAlerts } from "./alerts-D9yH7mOT.mjs";
import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as useLore, h as setWatch, i as confirmSighting, l as priorityHint, n as bottleById, o as markGone, r as bottles, s as materialize, u as priorityLabel, v as stores, x as useNow, y as tierLabel } from "./state-DBi-dSEi.mjs";
import { r as Route$1 } from "./router-uWSldKuA.mjs";
import { r as Page } from "./ui-Dey-L4Zm.mjs";
import { t as SightingRow } from "./sighting-row-DXJsD0Sv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bottles._bottleId-BkJdtYy_.js
var import_jsx_runtime = require_jsx_runtime();
var priorities = [
	"unicorn",
	"want",
	"curious"
];
function BottlePage() {
	const { bottleId } = Route$1.useParams();
	const bottle = bottleById[bottleId];
	const lore = useLore();
	const now = useNow();
	if (!bottle) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl",
		children: "Not in the hunt list"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/bottles",
		className: "mt-4 inline-block text-sm underline-offset-4 hover:underline",
		children: "All bottles"
	})] });
	const rows = materialize(lore).filter((s) => s.bottleId === bottle.id).sort((a, b) => ageMinutes(a, now) - ageMinutes(b, now));
	const latest = rows.find((s) => !lore.gone[s.id]) ?? rows[0];
	const watch = lore.watch[bottle.id];
	const real = latest ? planAlerts({
		sightings: materialize(lore),
		stores,
		bottles,
		prefs: lore.prefs,
		watch: lore.watch,
		gone: lore.gone,
		hour: 8,
		now
	}).find((r) => r.sighting.id === latest.id) : void 0;
	const asUnicorn = latest ? planAlerts({
		sightings: materialize(lore),
		stores,
		bottles,
		prefs: lore.prefs,
		watch: {
			...lore.watch,
			[bottle.id]: "unicorn"
		},
		gone: lore.gone,
		hour: 8,
		now
	}).find((r) => r.sighting.id === latest.id) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted",
			children: [
				bottle.maker,
				" · ",
				tierLabel[bottle.tier],
				" · typical shelf ",
				money(bottle.typical)
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl",
			children: bottle.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Your list"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid grid-cols-3 gap-1 rounded-lg border border-line p-1",
					children: priorities.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setWatch(bottle.id, watch === p ? null : p),
						className: `h-11 rounded text-sm ${watch === p ? "bg-ink text-bg" : "text-muted"}`,
						children: priorityLabel[p]
					}, p))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: watch ? priorityHint[watch] : "Not on your list. A lower priority never gets a louder channel."
				})
			]
		}),
		latest && real ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-5 text-sm",
			children: watch ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: "Latest sighting under your rules · "
			}), real.decision.reason] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted",
				children: "Not on your list. As a unicorn · "
			}), asUnicorn?.decision.reason] })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-5 text-sm text-muted",
			children: "Nothing reported for this bottle yet."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-xl",
			children: "Sightings"
		}),
		rows.length === 0 ? null : rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SightingRow, {
			sighting: s,
			now,
			freshWindowMin: lore.prefs.freshWindowMin,
			gone: Boolean(lore.gone[s.id]),
			onConfirm: () => confirmSighting(s.id),
			onGone: (g) => markGone(s.id, g)
		}, s.id))
	] });
}
//#endregion
export { BottlePage as component };
