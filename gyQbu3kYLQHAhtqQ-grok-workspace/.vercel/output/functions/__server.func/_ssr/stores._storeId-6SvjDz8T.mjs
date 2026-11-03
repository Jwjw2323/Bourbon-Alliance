import { t as ageMinutes } from "./format-14yrVs4e.mjs";
import { C as require_jsx_runtime, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as storeById, a as kindLabel, b as useLore, i as confirmSighting, o as markGone, p as setHomeStore, s as materialize, x as useNow } from "./state-DBi-dSEi.mjs";
import { n as Route } from "./router-uWSldKuA.mjs";
import { r as Page, t as Button } from "./ui-Dey-L4Zm.mjs";
import { t as SightingRow } from "./sighting-row-DXJsD0Sv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stores._storeId-6SvjDz8T.js
var import_jsx_runtime = require_jsx_runtime();
function StorePage() {
	const { storeId } = Route.useParams();
	const store = storeById[storeId];
	const lore = useLore();
	const now = useNow();
	const navigate = useNavigate();
	if (!store) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "font-display text-3xl",
		children: "Store not on the board"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/stores",
		className: "mt-4 inline-block text-sm underline-offset-4 hover:underline",
		children: "All stores"
	})] });
	const rows = materialize(lore).filter((s) => s.storeId === store.id).sort((a, b) => ageMinutes(a, now) - ageMinutes(b, now));
	const home = lore.homeStoreId === store.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted",
			children: [
				kindLabel[store.kind],
				" · ",
				store.city,
				", ",
				store.abbr
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-1 font-display text-3xl",
			children: store.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-ink",
			children: store.address
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-4 space-y-1 text-sm",
			children: [
				store.district ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "District"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: store.district })]
				}) : null,
				store.delivery ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Truck day"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: store.delivery })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Hours"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: store.hours })]
				}),
				store.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-muted",
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "underline-offset-4 hover:underline",
						href: `tel:${store.phone.replace(/[^\d+]/g, "")}`,
						children: store.phone
					}) })]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => navigate({
					to: "/report",
					search: { store: store.id }
				}),
				children: "Report this store"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "line",
				onClick: () => setHomeStore(home ? null : store.id),
				children: home ? "Clear home store" : "Make this home"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-xl",
			children: "On the board"
		}),
		rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-muted",
			children: "Nothing reported here yet."
		}) : rows.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SightingRow, {
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
export { StorePage as component };
