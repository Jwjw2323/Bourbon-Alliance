import { i as __toESM } from "../_runtime.mjs";
import { t as ageMinutes } from "./format-14yrVs4e.mjs";
import { C as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as useLore, r as bottles, s as materialize, u as priorityLabel, x as useNow } from "./state-DBi-dSEi.mjs";
import { i as fieldClass, r as Page } from "./ui-Dey-L4Zm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bottles-CT33QOGu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var groups = [
	{
		tier: "unicorn",
		title: "Allocated"
	},
	{
		tier: "limited",
		title: "Limited"
	},
	{
		tier: "shelf",
		title: "Shelf"
	}
];
function BottlesPage() {
	const lore = useLore();
	const now = useNow();
	const [q, setQ] = (0, import_react.useState)("");
	const freshCounts = (0, import_react.useMemo)(() => {
		const counts = {};
		for (const s of materialize(lore)) {
			if (lore.gone[s.id]) continue;
			if (ageMinutes(s, now) > lore.prefs.freshWindowMin) continue;
			counts[s.bottleId] = (counts[s.bottleId] ?? 0) + 1;
		}
		return counts;
	}, [lore, now]);
	const query = q.trim().toLowerCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Bottles"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-xl text-muted",
			children: "The hunt list, not the whole whiskey catalog. Everyday bottles stay off the board unless you ask for them."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search bottles",
			className: `${fieldClass} mt-5`
		}),
		groups.map((group) => {
			const list = bottles.filter((b) => {
				if (b.tier !== group.tier) return false;
				if (!query) return true;
				return `${b.name} ${b.maker}`.toLowerCase().includes(query);
			});
			if (!list.length) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: group.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2",
					children: list.map((b) => {
						const watch = lore.watch[b.id];
						const n = freshCounts[b.id] ?? 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-b border-line py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/bottles/$bottleId",
								params: { bottleId: b.id },
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-ink",
									children: b.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-muted",
									children: [b.maker, watch ? ` · ${priorityLabel[watch]}` : ""]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-sm tabular-nums text-muted",
									children: n === 0 ? "Quiet" : n === 1 ? "1 fresh" : `${n} fresh`
								})]
							})
						}, b.id);
					})
				})]
			}, group.tier);
		}),
		query && !bottles.some((b) => `${b.name} ${b.maker}`.toLowerCase().includes(query)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-muted",
			children: "No bottle by that name in the hunt list."
		}) : null
	] });
}
//#endregion
export { BottlesPage as component };
