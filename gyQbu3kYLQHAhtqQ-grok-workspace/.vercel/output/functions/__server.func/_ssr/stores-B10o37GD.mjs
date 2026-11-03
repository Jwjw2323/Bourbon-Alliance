import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as kindLabel, b as useLore, d as regionMeta, p as setHomeStore, v as stores } from "./state-DBi-dSEi.mjs";
import { n as Chip, r as Page } from "./ui-Dey-L4Zm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stores-B10o37GD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StoresPage() {
	const lore = useLore();
	const [region, setRegion] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const hits = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return stores.filter((s) => {
			if (region !== "all" && s.region !== region) return false;
			if (!query) return true;
			return `${s.name} ${s.city} ${s.address} ${s.number ?? ""}`.toLowerCase().includes(query);
		});
	}, [region, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Stores"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-xl text-muted",
			children: "Inner DMV shelves hunters actually drive. Delivery days are the last published truck day, not a promise."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 flex flex-wrap gap-2",
			children: [
				"all",
				"dc",
				"md",
				"va"
			].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				on: region === id,
				onClick: () => setRegion(id),
				children: id === "all" ? "All" : regionMeta[id].short
			}, id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search stores",
			className: "mt-3 h-11 w-full rounded-md border border-line bg-surface px-3 text-base placeholder:text-muted"
		}),
		[
			"dc",
			"md",
			"va"
		].map((id) => {
			const list = hits.filter((s) => s.region === id);
			if (!list.length) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl",
						children: regionMeta[id].name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: regionMeta[id].signal
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3",
						children: list.map((s) => {
							const home = lore.homeStoreId === s.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "border-b border-line py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/stores/$storeId",
										params: { storeId: s.id },
										className: "text-ink underline-offset-4 hover:underline",
										children: s.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted",
										children: [
											s.city,
											", ",
											s.abbr,
											" · ",
											kindLabel[s.kind],
											s.delivery ? ` · Trucks ${s.delivery}` : "",
											home ? " · Home" : ""
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "shrink-0 text-sm text-muted underline-offset-4 hover:text-ink hover:underline",
										onClick: () => setHomeStore(home ? null : s.id),
										children: home ? "Clear home" : "Make home"
									})]
								})
							}, s.id);
						})
					})
				]
			}, id);
		})
	] });
}
//#endregion
export { StoresPage as component };
