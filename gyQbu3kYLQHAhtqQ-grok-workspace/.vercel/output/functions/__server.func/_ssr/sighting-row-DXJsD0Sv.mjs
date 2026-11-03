import { i as money, n as formatAge, t as ageMinutes } from "./format-14yrVs4e.mjs";
import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as storeById, c as placementLabel, g as sourceLabel, n as bottleById, y as tierLabel } from "./state-DBi-dSEi.mjs";
import { t as Button } from "./ui-Dey-L4Zm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sighting-row-DXJsD0Sv.js
var import_jsx_runtime = require_jsx_runtime();
function SightingRow({ sighting, now, freshWindowMin, gone, onConfirm, onGone }) {
	const bottle = bottleById[sighting.bottleId];
	const store = storeById[sighting.storeId];
	if (!bottle || !store) return null;
	const mins = ageMinutes(sighting, now);
	const fresh = mins <= freshWindowMin && !gone;
	const hunters = sighting.source === "hunter" ? sighting.confirms === 1 ? "1 hunter" : `${sighting.confirms} hunters` : "Published count";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "border-b border-line py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted tabular-nums",
					children: [
						formatAge(mins),
						" · ",
						sourceLabel[sighting.source]
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm tabular-nums text-ink",
					children: money(sighting.price)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex flex-wrap items-baseline gap-x-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-ink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bottles/$bottleId",
						params: { bottleId: bottle.id },
						className: "underline-offset-4 hover:underline",
						children: bottle.name
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted",
					children: tierLabel[bottle.tier]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/stores/$storeId",
					params: { storeId: store.id },
					className: "underline-offset-4 hover:underline",
					children: store.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted",
					children: [
						" ",
						"· ",
						store.city,
						", ",
						store.abbr
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-ink",
						children: sighting.qty
					}),
					" · ",
					placementLabel[sighting.placement],
					" · ",
					hunters,
					" · ",
					gone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-accent",
						children: "Gone"
					}) : fresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-live",
						children: "Fresh"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Aging" })
				]
			}),
			sighting.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: sighting.note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "line",
					disabled: gone,
					onClick: onConfirm,
					children: "I see it too"
				}), gone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => onGone(false),
					children: "Bring back"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => onGone(true),
					children: "Gone"
				})]
			})
		]
	});
}
//#endregion
export { SightingRow as t };
