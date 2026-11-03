import { i as __toESM } from "../_runtime.mjs";
import { t as ageMinutes } from "./format-14yrVs4e.mjs";
import { C as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as storeById, b as useLore, d as regionMeta, i as confirmSighting, n as bottleById, o as markGone, s as materialize, x as useNow } from "./state-DBi-dSEi.mjs";
import { n as Chip, r as Page } from "./ui-Dey-L4Zm.mjs";
import { t as SightingRow } from "./sighting-row-DXJsD0Sv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-F7qWngpn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var regions = [
	"all",
	"dc",
	"md",
	"va"
];
function Board() {
	const lore = useLore();
	const now = useNow();
	const [region, setRegion] = (0, import_react.useState)("all");
	const [mine, setMine] = (0, import_react.useState)(false);
	const [freshOnly, setFreshOnly] = (0, import_react.useState)(false);
	const [showGone, setShowGone] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return materialize(lore).filter((s) => {
			const store = storeById[s.storeId];
			if (!store) return false;
			if (region !== "all" && store.region !== region) return false;
			if (mine && !lore.watch[s.bottleId]) return false;
			if (!showGone && lore.gone[s.id]) return false;
			if (freshOnly && (lore.gone[s.id] || ageMinutes(s, now) > lore.prefs.freshWindowMin)) return false;
			if (!query) return true;
			const bottle = bottleById[s.bottleId];
			return `${store.name} ${store.city} ${store.number ?? ""} ${bottle?.name ?? ""} ${bottle?.maker ?? ""}`.toLowerCase().includes(query);
		}).sort((a, b) => ageMinutes(a, now) - ageMinutes(b, now));
	}, [
		lore,
		region,
		mine,
		freshOnly,
		showGone,
		q,
		now
	]);
	const home = lore.homeStoreId ? storeById[lore.homeStoreId] : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "DC · Maryland · Virginia"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl text-ink",
			children: "The board"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-xl text-muted",
			children: "Hunters report what is actually on the shelf. Virginia ABC and Montgomery County counts show up when those agencies publish them. Sample shelf, real stores — not today’s inventory."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-wrap gap-2",
			children: [
				regions.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: region === id,
					onClick: () => setRegion(id),
					children: id === "all" ? "All" : regionMeta[id].short
				}, id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: mine,
					onClick: () => setMine((v) => !v),
					children: "My list"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: freshOnly,
					onClick: () => setFreshOnly((v) => !v),
					children: "Fresh"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					on: showGone,
					onClick: () => setShowGone((v) => !v),
					children: "Show gone"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-3 block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Search the board"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Search a bottle or store",
				className: "h-11 w-full rounded-md border border-line bg-surface px-3 text-base text-ink placeholder:text-muted"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 text-sm text-muted tabular-nums",
			children: [
				rows.length,
				" on the board",
				home ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					" ",
					"· Home store ",
					home.name
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					" ",
					"· ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/stores",
						className: "text-ink underline-offset-4 hover:underline",
						children: "Set a home store"
					})
				] })
			]
		}),
		rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-muted",
			children: "Nothing matches. Clear a filter, or report what you just saw."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2",
			children: rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SightingRow, {
				sighting: s,
				now,
				freshWindowMin: lore.prefs.freshWindowMin,
				gone: Boolean(lore.gone[s.id]),
				onConfirm: () => confirmSighting(s.id),
				onGone: (g) => markGone(s.id, g)
			}, s.id))
		})
	] });
}
//#endregion
export { Board as component };
