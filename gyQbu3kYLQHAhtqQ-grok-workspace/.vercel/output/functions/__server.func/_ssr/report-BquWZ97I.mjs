import { i as __toESM } from "../_runtime.mjs";
import { i as money } from "./format-14yrVs4e.mjs";
import { n as planAlerts } from "./alerts-D9yH7mOT.mjs";
import { C as require_jsx_runtime, Y as require_react, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as kindLabel, b as useLore, n as bottleById, r as bottles, t as addSightings, u as priorityLabel, v as stores, x as useNow } from "./state-DBi-dSEi.mjs";
import { o as Check } from "../_libs/lucide-react.mjs";
import { i as Route$3 } from "./router-uWSldKuA.mjs";
import { i as fieldClass, n as Chip, r as Page, t as Button } from "./ui-Dey-L4Zm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-BquWZ97I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportPage() {
	const { store: storeParam } = Route$3.useSearch();
	const lore = useLore();
	const now = useNow();
	const navigate = useNavigate();
	const preset = storeParam && stores.some((s) => s.id === storeParam) ? storeParam : "";
	const [step, setStep] = (0, import_react.useState)(preset ? 2 : 1);
	const [storeId, setStoreId] = (0, import_react.useState)(preset);
	const [storeQuery, setStoreQuery] = (0, import_react.useState)("");
	const [bottleQuery, setBottleQuery] = (0, import_react.useState)("");
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [logged, setLogged] = (0, import_react.useState)([]);
	const store = stores.find((s) => s.id === storeId);
	const storeHits = (0, import_react.useMemo)(() => {
		const q = storeQuery.trim().toLowerCase();
		return stores.filter((s) => {
			if (!q) return true;
			return `${s.name} ${s.city} ${s.address} ${s.number ?? ""}`.toLowerCase().includes(q);
		});
	}, [storeQuery]);
	const bottleHits = (0, import_react.useMemo)(() => {
		const q = bottleQuery.trim().toLowerCase();
		return [...bottles.filter((b) => {
			const watched = Boolean(lore.watch[b.id]);
			if (!q && b.tier === "shelf" && !watched) return false;
			if (!q) return true;
			return `${b.name} ${b.maker}`.toLowerCase().includes(q);
		})].sort((a, b) => {
			return (lore.watch[a.id] ? 0 : 1) - (lore.watch[b.id] ? 0 : 1) || a.name.localeCompare(b.name);
		});
	}, [bottleQuery, lore.watch]);
	function toggleBottle(id) {
		setPicked((curr) => {
			if (curr.includes(id)) return curr.filter((x) => x !== id);
			const bottle = bottleById[id];
			setDrafts((d) => ({
				...d,
				[id]: d[id] ?? {
					qty: 1,
					price: bottle ? bottle.typical.toFixed(2) : "",
					placement: "shelf",
					note: ""
				}
			}));
			return [...curr, id];
		});
	}
	function submit() {
		if (!storeId || picked.length === 0) return;
		const seenAt = (/* @__PURE__ */ new Date()).toISOString();
		const created = picked.map((id) => {
			const draft = drafts[id] ?? {
				qty: 1,
				price: "",
				placement: "shelf",
				note: ""
			};
			const price = Number(draft.price);
			return {
				id: crypto.randomUUID(),
				storeId,
				bottleId: id,
				qty: draft.qty,
				price: Number.isFinite(price) && draft.price.trim() !== "" ? price : null,
				placement: draft.placement,
				source: "hunter",
				ageMin: 0,
				seenAt,
				confirms: 1,
				note: draft.note.trim() || void 0,
				reporter: "You"
			};
		});
		addSightings(created);
		setLogged(created);
		setStep(4);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		width: "narrow",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Step ",
					Math.min(step, 3),
					" of 3"
				]
			}),
			step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl",
					children: "Where did you see it?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: storeQuery,
					onChange: (e) => setStoreQuery(e.target.value),
					placeholder: "Store name, city, or number",
					className: `${fieldClass} mt-5`,
					autoFocus: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3",
					children: storeHits.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-b border-line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex w-full flex-col items-start py-3 text-left",
							onClick: () => {
								setStoreId(s.id);
								setStep(2);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-ink",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted",
								children: [
									s.city,
									", ",
									s.abbr,
									" · ",
									kindLabel[s.kind]
								]
							})]
						})
					}, s.id))
				})
			] }) : null,
			step === 2 && store ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl",
					children: "What’s on the shelf?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						store.name,
						" · ",
						store.city,
						". Pick every allocated bottle you can see. Skip the everyday stuff unless it is on your list."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: bottleQuery,
					onChange: (e) => setBottleQuery(e.target.value),
					placeholder: "Search bottles",
					className: `${fieldClass} mt-5`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3",
					children: bottleHits.map((b) => {
						const on = picked.includes(b.id);
						const watch = lore.watch[b.id];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-b border-line",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex w-full items-center justify-between gap-3 py-3 text-left",
								onClick: () => toggleBottle(b.id),
								"aria-pressed": on,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-ink",
									children: b.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-muted",
									children: [b.maker, watch ? ` · ${priorityLabel[watch]}` : ""]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `grid size-6 place-items-center rounded-sm border ${on ? "border-ink bg-ink text-bg" : "border-line"}`,
									"aria-hidden": "true",
									children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : null
								})]
							})
						}, b.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "line",
						onClick: () => setStep(1),
						children: "Back"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: picked.length === 0,
						onClick: () => setStep(3),
						children: picked.length === 0 ? "Pick a bottle" : `Next · ${picked.length}`
					})]
				})
			] }) : null,
			step === 3 && store ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl",
					children: "How many, and where?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [store.name, ". Price can stay blank."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 space-y-6",
					children: picked.map((id) => {
						const bottle = bottleById[id];
						const draft = drafts[id];
						if (!bottle || !draft) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
							className: "border-b border-line pb-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "font-display text-lg",
									children: bottle.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "line",
											className: "w-11 px-0",
											onClick: () => setDrafts((d) => ({
												...d,
												[id]: {
													...draft,
													qty: Math.max(1, draft.qty - 1)
												}
											})),
											"aria-label": "Fewer",
											children: "−"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-8 text-center tabular-nums",
											children: draft.qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "line",
											className: "w-11 px-0",
											onClick: () => setDrafts((d) => ({
												...d,
												[id]: {
													...draft,
													qty: Math.min(12, draft.qty + 1)
												}
											})),
											"aria-label": "More",
											children: "+"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-muted",
											children: "on hand"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: [
										"shelf",
										"counter",
										"case"
									].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
										on: draft.placement === p,
										onClick: () => setDrafts((d) => ({
											...d,
											[id]: {
												...draft,
												placement: p
											}
										})),
										children: p === "shelf" ? "Shelf" : p === "counter" ? "Counter" : "Case"
									}, p))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mt-3 block text-sm text-muted",
									children: ["Price", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										inputMode: "decimal",
										value: draft.price,
										onChange: (e) => setDrafts((d) => ({
											...d,
											[id]: {
												...draft,
												price: e.target.value
											}
										})),
										className: `${fieldClass} mt-1`
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mt-3 block text-sm text-muted",
									children: ["Note, if it matters", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: draft.note,
										maxLength: 80,
										onChange: (e) => setDrafts((d) => ({
											...d,
											[id]: {
												...draft,
												note: e.target.value
											}
										})),
										placeholder: "Limit one, ask at the counter",
										className: `${fieldClass} mt-1`
									})]
								})
							]
						}, id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "line",
						onClick: () => setStep(2),
						children: "Back"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: submit,
						children: "Log it"
					})]
				})
			] }) : null,
			step === 4 && store ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Done, {
				storeName: store.name,
				logged,
				lore,
				now,
				onBoard: () => navigate({ to: "/" })
			}) : null
		]
	});
}
function Done({ storeName, logged, lore, now, onBoard }) {
	const base = {
		sightings: logged,
		stores,
		bottles,
		prefs: lore.prefs,
		gone: {},
		hour: 8,
		now
	};
	const mine = planAlerts({
		...base,
		watch: lore.watch
	});
	const asUnicorn = planAlerts({
		...base,
		watch: Object.fromEntries(logged.map((s) => [s.bottleId, "unicorn"]))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "mt-1 font-display text-3xl",
			children: [
				"Logged at ",
				storeName,
				"."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-muted",
			children: "You are the first report, so a text waits for a second hunter. That is the fatigue rule doing its job. This preview keeps the report on this device."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 space-y-4",
			children: logged.map((s) => {
				const bottle = bottleById[s.bottleId];
				const yours = mine.find((r) => r.sighting.id === s.id);
				const other = asUnicorn.find((r) => r.sighting.id === s.id);
				if (!bottle || !yours || !other) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-b border-line pb-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg",
							children: bottle.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted tabular-nums",
							children: [
								s.qty,
								" · ",
								money(s.price)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "You · "
							}), yours.decision.reason]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "A hunter who lists it as a unicorn · "
							}), other.decision.reason]
						})
					]
				}, s.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onBoard,
				children: "Back to the board"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/alerts",
				className: "inline-flex h-11 items-center px-2 text-sm text-ink underline-offset-4 hover:underline",
				children: "Tune the rules"
			})]
		})
	] });
}
//#endregion
export { ReportPage as component };
