import { i as __toESM } from "../_runtime.mjs";
import { r as hourLabel } from "./format-14yrVs4e.mjs";
import { n as planAlerts, t as PREVIEW_CLOCK } from "./alerts-D9yH7mOT.mjs";
import { C as require_jsx_runtime, Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as useLore, d as regionMeta, f as resetDevice, h as setWatch, l as priorityHint, m as setPrefs, n as bottleById, r as bottles, s as materialize, u as priorityLabel, v as stores, x as useNow } from "./state-DBi-dSEi.mjs";
import { r as Page, t as Button } from "./ui-Dey-L4Zm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts-DFCX78Hd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var channelName = {
	sms: "Text",
	email: "Email",
	digest: "Morning note",
	board: "Board only",
	drop: "Held"
};
var priorities = [
	"unicorn",
	"want",
	"curious"
];
function AlertsPage() {
	const lore = useLore();
	const now = useNow();
	const [addId, setAddId] = (0, import_react.useState)("");
	const planned = (0, import_react.useMemo)(() => planAlerts({
		sightings: materialize(lore),
		stores,
		bottles,
		prefs: lore.prefs,
		watch: lore.watch,
		gone: lore.gone,
		hour: 8,
		now
	}), [lore, now]);
	const watched = planned.filter((row) => lore.watch[row.bottle.id]);
	const ignored = planned.length - watched.length;
	const counts = watched.reduce((acc, row) => {
		acc[row.decision.channel] += 1;
		return acc;
	}, {
		sms: 0,
		email: 0,
		digest: 0,
		board: 0,
		drop: 0
	});
	const ordered = [...watched].sort((a, b) => {
		const rank = {
			sms: 0,
			email: 1,
			digest: 2,
			board: 3,
			drop: 4
		};
		return rank[a.decision.channel] - rank[b.decision.channel];
	});
	const unwatched = bottles.filter((b) => !lore.watch[b.id]);
	function toggleRegion(id) {
		const regions = lore.prefs.regions.includes(id) ? lore.prefs.regions.filter((r) => r !== id) : [...lore.prefs.regions, id];
		setPrefs({
			...lore.prefs,
			regions
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Alerts"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-xl text-muted",
			children: "Priority sets the loudest channel. The gates below can only make a ping quieter. A curious bottle never becomes a text."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-muted",
			children: [
				"Scored as of ",
				PREVIEW_CLOCK,
				", just after quiet hours, so you can see a morning board. This preview does not send texts or email."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Your list"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3",
					children: Object.entries(lore.watch).map(([id, priority]) => {
						const bottle = bottleById[id];
						if (!bottle) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-b border-line py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-ink",
										children: bottle.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-sm text-muted underline-offset-4 hover:underline",
										onClick: () => setWatch(id, null),
										children: "Remove"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 grid grid-cols-3 gap-1 rounded-lg border border-line p-1",
									children: priorities.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWatch(id, p),
										className: `h-10 rounded text-sm ${priority === p ? "bg-ink text-bg" : "text-muted"}`,
										children: priorityLabel[p]
									}, p))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: priorityHint[priority]
								})
							]
						}, id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: addId,
						onChange: (e) => setAddId(e.target.value),
						className: "h-11 min-w-0 flex-1 rounded-md border border-line bg-surface px-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Add a bottle"
						}), unwatched.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: b.id,
							children: b.name
						}, b.id))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "line",
						disabled: !addId,
						onClick: () => {
							if (!addId) return;
							setWatch(addId, "want");
							setAddId("");
						},
						children: "Add"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Gates"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						"dc",
						"md",
						"va"
					].map((id) => {
						const on = lore.prefs.regions.includes(id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => toggleRegion(id),
							className: `h-9 rounded-full border px-3 text-sm ${on ? "border-ink bg-ink text-bg" : "border-line text-muted"}`,
							children: regionMeta[id].short
						}, id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Texts",
							hint: "Only unicorns, and only if the other gates pass.",
							on: lore.prefs.sms,
							onClick: () => setPrefs({
								...lore.prefs,
								sms: !lore.prefs.sms
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Email and morning note",
							hint: "The quieter channel. Also where held texts go.",
							on: lore.prefs.email,
							onClick: () => setPrefs({
								...lore.prefs,
								email: !lore.prefs.email
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Second hunter before a text",
							hint: "A published ABC or ABS count counts as the second source.",
							on: lore.prefs.corroborationForSms,
							onClick: () => setPrefs({
								...lore.prefs,
								corroborationForSms: !lore.prefs.corroborationForSms
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm text-muted",
						children: ["Quiet from", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-ink",
							value: lore.prefs.quietStart,
							onChange: (e) => setPrefs({
								...lore.prefs,
								quietStart: Number(e.target.value)
							}),
							children: hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: h,
								children: hourLabel(h)
							}, h))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm text-muted",
						children: ["Quiet until", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: "mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-ink",
							value: lore.prefs.quietEnd,
							onChange: (e) => setPrefs({
								...lore.prefs,
								quietEnd: Number(e.target.value)
							}),
							children: hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: h,
								children: hourLabel(h)
							}, h))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
					label: "Cooldown",
					value: lore.prefs.cooldownHours,
					options: [
						[6, "6h"],
						[12, "12h"],
						[24, "24h"]
					],
					onChange: (n) => setPrefs({
						...lore.prefs,
						cooldownHours: n
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
					label: "Texts per day",
					value: lore.prefs.smsDailyCap,
					options: [
						[1, "1"],
						[3, "3"],
						[5, "5"]
					],
					onChange: (n) => setPrefs({
						...lore.prefs,
						smsDailyCap: n
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
					label: "Fresh window",
					value: lore.prefs.freshWindowMin,
					options: [
						[45, "45m"],
						[90, "90m"],
						[180, "3h"]
					],
					onChange: (n) => setPrefs({
						...lore.prefs,
						freshWindowMin: n
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "This morning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm tabular-nums text-muted",
					children: [
						counts.sms,
						" texts · ",
						counts.email,
						" emails · ",
						counts.digest,
						" morning notes · ",
						counts.board,
						" on the board · ",
						counts.drop,
						" held"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [ignored, " other sightings are not on your list, so they never leave the board."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3",
					children: ordered.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-b border-line py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-ink",
									children: row.bottle.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: row.decision.channel === "sms" ? "text-sm text-live" : "text-sm text-muted",
									children: channelName[row.decision.channel]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									row.store.name,
									" · ",
									row.store.city
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: row.decision.reason
							})
						]
					}, row.sighting.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "mt-8 text-sm text-muted underline-offset-4 hover:underline",
			onClick: () => resetDevice(),
			children: "Reset this device"
		})
	] });
}
var hours = Array.from({ length: 24 }, (_, i) => i);
function Toggle({ label, hint, on, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		"aria-pressed": on,
		className: "flex w-full items-start justify-between gap-4 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-sm text-ink",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-sm text-muted",
				children: hint
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `mt-1 h-6 w-11 shrink-0 rounded-full p-0.5 ${on ? "bg-ink" : "bg-line"}`,
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `block size-5 rounded-full bg-surface ${on ? "ml-auto" : ""}` })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: on ? "On" : "Off"
			})
		]
	});
}
function Choice({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 grid grid-cols-3 gap-1 rounded-lg border border-line p-1",
			children: options.map(([n, text]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(n),
				className: `h-10 rounded text-sm tabular-nums ${value === n ? "bg-ink text-bg" : "text-muted"}`,
				children: text
			}, n))
		})]
	});
}
//#endregion
export { AlertsPage as component };
