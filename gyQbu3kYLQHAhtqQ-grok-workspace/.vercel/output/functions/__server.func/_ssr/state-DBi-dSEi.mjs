import { i as __toESM } from "../_runtime.mjs";
import { Y as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/state-DBi-dSEi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var regionMeta = {
	dc: {
		name: "Washington, DC",
		short: "DC",
		signal: "No control board. If a bottle is listed here, a hunter saw it."
	},
	md: {
		name: "Maryland",
		short: "Maryland",
		signal: "Montgomery County ABS publishes a catalog. The rest of Maryland is private retail, so sightings are the stock. Those counties plug in next."
	},
	va: {
		name: "Virginia",
		short: "Virginia",
		signal: "Virginia ABC publishes store counts. They go stale once the doors open. Hunters cover that gap."
	}
};
var dcStores = [
	{
		id: "dc-schneiders",
		region: "dc",
		kind: "private",
		name: "Schneider's of Capitol Hill",
		address: "300 Massachusetts Ave NE",
		city: "Washington",
		abbr: "DC",
		hours: "Call the shop for today's hours"
	},
	{
		id: "dc-ace",
		region: "dc",
		kind: "private",
		name: "Ace Beverage",
		address: "3301 New Mexico Ave NW",
		city: "Washington",
		abbr: "DC",
		hours: "Call the shop for today's hours"
	},
	{
		id: "dc-calvert",
		region: "dc",
		kind: "private",
		name: "Calvert Woodley",
		address: "4339 Connecticut Ave NW",
		city: "Washington",
		abbr: "DC",
		hours: "Call the shop for today's hours"
	},
	{
		id: "dc-macarthur",
		region: "dc",
		kind: "private",
		name: "MacArthur Beverages",
		address: "4877 MacArthur Blvd NW",
		city: "Washington",
		abbr: "DC",
		hours: "Call the shop for today's hours"
	}
];
var mdStores = [
	{
		id: "abs-hampden",
		region: "md",
		kind: "abs",
		name: "Hampden Lane",
		address: "4920 Hampden Ln",
		city: "Bethesda",
		abbr: "MD",
		hours: "10 a.m.–9 p.m., Sun 12–5 p.m.",
		phone: "(240) 773-2006"
	},
	{
		id: "abs-westbard",
		region: "md",
		kind: "abs",
		name: "Westbard",
		address: "5390 Westbard Ave",
		city: "Bethesda",
		abbr: "MD",
		hours: "10 a.m.–9 p.m., Sun 12–5 p.m.",
		phone: "(240) 773-2024"
	},
	{
		id: "abs-rockville",
		region: "md",
		kind: "abs",
		name: "Downtown Rockville",
		address: "300 N Washington St",
		city: "Rockville",
		abbr: "MD",
		hours: "10 a.m.–9 p.m., Sun 12–5 p.m.",
		phone: "(240) 773-2027"
	},
	{
		id: "abs-fallsgrove",
		region: "md",
		kind: "abs",
		name: "Fallsgrove",
		address: "14937 Shady Grove Rd, Unit E",
		city: "Rockville",
		abbr: "MD",
		hours: "10 a.m.–9 p.m., Sun 12–5 p.m.",
		phone: "(240) 773-2018"
	},
	{
		id: "abs-wheaton",
		region: "md",
		kind: "abs",
		name: "Wheaton",
		address: "11160 Veirs Mill Rd",
		city: "Wheaton",
		abbr: "MD",
		hours: "10 a.m.–9 p.m., Sun 12–5 p.m.",
		phone: "(240) 773-2025"
	}
];
var vaStores = [
	{
		id: "va-119",
		region: "va",
		kind: "abc",
		name: "ABC 119",
		number: "119",
		address: "501 Montgomery Street",
		city: "Alexandria",
		abbr: "VA",
		district: "D07",
		delivery: "Tue",
		hours: "Typical ABC day — confirm before you drive"
	},
	{
		id: "va-203",
		region: "va",
		kind: "abc",
		name: "ABC 203",
		number: "203",
		address: "3678 King Street",
		city: "Alexandria",
		abbr: "VA",
		district: "D18",
		delivery: "Thu",
		hours: "Typical ABC day — confirm before you drive"
	},
	{
		id: "va-80",
		region: "va",
		kind: "abc",
		name: "ABC 80",
		number: "80",
		address: "6206 Little River Turnpike",
		city: "Alexandria",
		abbr: "VA",
		district: "D07",
		delivery: "Tue",
		hours: "Typical ABC day — confirm before you drive"
	},
	{
		id: "va-42",
		region: "va",
		kind: "abc",
		name: "ABC 42",
		number: "42",
		address: "7451 Mt Vernon Square Circle",
		city: "Alexandria",
		abbr: "VA",
		district: "D16",
		delivery: "Thu",
		hours: "Typical ABC day — confirm before you drive"
	},
	{
		id: "va-372",
		region: "va",
		kind: "abc",
		name: "ABC 372",
		number: "372",
		address: "3161 Duke Street",
		city: "Alexandria",
		abbr: "VA",
		district: "D16",
		delivery: "Tue",
		hours: "Typical ABC day — confirm before you drive"
	},
	{
		id: "va-352",
		region: "va",
		kind: "abc",
		name: "ABC 352",
		number: "352",
		address: "2555 John Milton Drive",
		city: "Herndon",
		abbr: "VA",
		district: "D18",
		delivery: "Tue",
		hours: "Mon–Sat 10 a.m.–9 p.m., Sun 10 a.m.–6 p.m.",
		phone: "(703) 860-4080"
	},
	{
		id: "va-268",
		region: "va",
		kind: "abc",
		name: "ABC 268",
		number: "268",
		address: "6402 Springfield Plaza",
		city: "Springfield",
		abbr: "VA",
		hours: "10 a.m.–10 p.m.",
		phone: "(703) 866-7835"
	},
	{
		id: "va-99",
		region: "va",
		kind: "abc",
		name: "ABC 99",
		number: "99",
		address: "378-380 Elden Street",
		city: "Herndon",
		abbr: "VA",
		hours: "Typical ABC day — confirm before you drive"
	}
];
var stores = [
	...dcStores,
	...mdStores,
	...vaStores
];
var bottles = [
	{
		id: "blantons",
		name: "Blanton's Single Barrel",
		maker: "Buffalo Trace",
		tier: "unicorn",
		typical: 64.99
	},
	{
		id: "eht-sb",
		name: "E.H. Taylor Small Batch",
		maker: "Buffalo Trace",
		tier: "unicorn",
		typical: 49.99
	},
	{
		id: "weller-107",
		name: "Weller Antique 107",
		maker: "Buffalo Trace",
		tier: "unicorn",
		typical: 54.99
	},
	{
		id: "weller-12",
		name: "W.L. Weller 12 Year",
		maker: "Buffalo Trace",
		tier: "unicorn",
		typical: 59.99
	},
	{
		id: "stagg",
		name: "Stagg",
		maker: "Buffalo Trace",
		tier: "unicorn",
		typical: 69.99
	},
	{
		id: "etl",
		name: "Elmer T. Lee",
		maker: "Buffalo Trace",
		tier: "unicorn",
		typical: 39.99
	},
	{
		id: "pappy-15",
		name: "Pappy Van Winkle 15 Year",
		maker: "Buffalo Trace",
		tier: "unicorn",
		typical: 129.99
	},
	{
		id: "of-birthday",
		name: "Old Forester Birthday Bourbon",
		maker: "Brown-Forman",
		tier: "unicorn",
		typical: 159.99
	},
	{
		id: "rr13",
		name: "Russell's Reserve 13 Year",
		maker: "Wild Turkey",
		tier: "limited",
		typical: 89.99
	},
	{
		id: "michters-10",
		name: "Michter's 10 Year Bourbon",
		maker: "Michter's",
		tier: "limited",
		typical: 159.99
	},
	{
		id: "ecbp",
		name: "Elijah Craig Barrel Proof",
		maker: "Heaven Hill",
		tier: "limited",
		typical: 74.99
	},
	{
		id: "eagle",
		name: "Eagle Rare 10 Year",
		maker: "Buffalo Trace",
		tier: "limited",
		typical: 44.99
	},
	{
		id: "weller-sr",
		name: "Weller Special Reserve",
		maker: "Buffalo Trace",
		tier: "limited",
		typical: 29.99
	},
	{
		id: "bowman",
		name: "John J. Bowman Single Barrel",
		maker: "A. Smith Bowman",
		tier: "shelf",
		typical: 54.99
	},
	{
		id: "bt",
		name: "Buffalo Trace",
		maker: "Buffalo Trace",
		tier: "shelf",
		typical: 29.99
	},
	{
		id: "hh-bib",
		name: "Heaven Hill Bottled-in-Bond",
		maker: "Heaven Hill",
		tier: "shelf",
		typical: 49.99
	}
];
var seedSightings = [
	{
		id: "s-w107",
		storeId: "dc-schneiders",
		bottleId: "weller-107",
		qty: 3,
		price: 59.99,
		placement: "shelf",
		source: "hunter",
		ageMin: 14,
		confirms: 2,
		reporter: "Jonah",
		note: "Limit one."
	},
	{
		id: "s-stagg",
		storeId: "abs-westbard",
		bottleId: "stagg",
		qty: 1,
		price: 69.99,
		placement: "counter",
		source: "hunter",
		ageMin: 18,
		confirms: 2,
		reporter: "Nia",
		note: "Ask at the counter."
	},
	{
		id: "s-blantons",
		storeId: "va-119",
		bottleId: "blantons",
		qty: 2,
		price: 64.99,
		placement: "shelf",
		source: "hunter",
		ageMin: 22,
		confirms: 2,
		reporter: "Ada M."
	},
	{
		id: "s-birthday",
		storeId: "dc-macarthur",
		bottleId: "of-birthday",
		qty: 1,
		price: 159.99,
		placement: "case",
		source: "hunter",
		ageMin: 25,
		confirms: 2,
		reporter: "Owen T.",
		note: "Manager is taking names."
	},
	{
		id: "s-bt",
		storeId: "va-80",
		bottleId: "bt",
		qty: 18,
		price: 29.99,
		placement: "shelf",
		source: "va_abc",
		ageMin: 30,
		confirms: 1,
		reporter: "VA ABC"
	},
	{
		id: "s-w12",
		storeId: "dc-ace",
		bottleId: "weller-12",
		qty: 1,
		price: 59.99,
		placement: "counter",
		source: "hunter",
		ageMin: 35,
		confirms: 1,
		reporter: "Chris P.",
		note: "Behind the counter."
	},
	{
		id: "s-eht",
		storeId: "abs-hampden",
		bottleId: "eht-sb",
		qty: 1,
		price: 49.99,
		placement: "counter",
		source: "hunter",
		ageMin: 41,
		confirms: 1,
		reporter: "R. Ellis"
	},
	{
		id: "s-rr13",
		storeId: "dc-calvert",
		bottleId: "rr13",
		qty: 1,
		price: 89.99,
		placement: "shelf",
		source: "hunter",
		ageMin: 48,
		confirms: 1,
		reporter: "Mara K."
	},
	{
		id: "s-eagle",
		storeId: "va-352",
		bottleId: "eagle",
		qty: 6,
		price: 44.99,
		placement: "shelf",
		source: "va_abc",
		ageMin: 55,
		confirms: 1,
		reporter: "VA ABC"
	},
	{
		id: "s-wsr",
		storeId: "abs-fallsgrove",
		bottleId: "weller-sr",
		qty: 4,
		price: 29.99,
		placement: "shelf",
		source: "hunter",
		ageMin: 70,
		confirms: 1,
		reporter: "Jonah"
	},
	{
		id: "s-ecbp",
		storeId: "va-268",
		bottleId: "ecbp",
		qty: 3,
		price: 74.99,
		placement: "shelf",
		source: "hunter",
		ageMin: 80,
		confirms: 2,
		reporter: "Ada M."
	},
	{
		id: "s-bowman",
		storeId: "va-42",
		bottleId: "bowman",
		qty: 8,
		price: 54.99,
		placement: "shelf",
		source: "va_abc",
		ageMin: 20,
		confirms: 1,
		reporter: "VA ABC"
	},
	{
		id: "s-etl",
		storeId: "va-203",
		bottleId: "etl",
		qty: 1,
		price: 39.99,
		placement: "shelf",
		source: "hunter",
		ageMin: 150,
		confirms: 1,
		reporter: "Owen T."
	},
	{
		id: "s-michters",
		storeId: "abs-wheaton",
		bottleId: "michters-10",
		qty: 2,
		price: 159.99,
		placement: "shelf",
		source: "moco",
		ageMin: 200,
		confirms: 1,
		reporter: "MoCo ABS"
	},
	{
		id: "s-blantons-old",
		storeId: "va-119",
		bottleId: "blantons",
		qty: 1,
		price: 64.99,
		placement: "shelf",
		source: "hunter",
		ageMin: 400,
		confirms: 1,
		reporter: "Chris P."
	},
	{
		id: "s-pappy",
		storeId: "dc-calvert",
		bottleId: "pappy-15",
		qty: 1,
		price: 129.99,
		placement: "case",
		source: "hunter",
		ageMin: 480,
		confirms: 1,
		reporter: "Nia",
		note: "Saw the box. Not a promise it is still in the case."
	}
];
var storeById = Object.fromEntries(stores.map((s) => [s.id, s]));
var bottleById = Object.fromEntries(bottles.map((b) => [b.id, b]));
var kindLabel = {
	abc: "Virginia ABC",
	abs: "Montgomery ABS",
	private: "Private shop"
};
var sourceLabel = {
	hunter: "Hunter",
	va_abc: "VA ABC",
	moco: "MoCo ABS"
};
var tierLabel = {
	unicorn: "Allocated",
	limited: "Limited",
	shelf: "Shelf"
};
var placementLabel = {
	shelf: "On the shelf",
	counter: "Behind the counter",
	case: "In the case"
};
var priorityLabel = {
	unicorn: "Unicorn",
	want: "Want",
	curious: "Curious"
};
var priorityHint = {
	unicorn: "Can text you",
	want: "Morning note",
	curious: "Board only"
};
var KEY = "lore-board-v1";
var defaultPrefs = {
	regions: [
		"dc",
		"md",
		"va"
	],
	sms: true,
	email: true,
	quietStart: 21,
	quietEnd: 8,
	cooldownHours: 12,
	smsDailyCap: 3,
	corroborationForSms: true,
	freshWindowMin: 90
};
var defaultWatch = {
	blantons: "unicorn",
	"eht-sb": "unicorn",
	"weller-107": "unicorn",
	stagg: "unicorn",
	"of-birthday": "unicorn",
	"pappy-15": "unicorn",
	eagle: "want",
	"weller-sr": "want",
	bt: "curious"
};
var REGIONS = [
	"dc",
	"md",
	"va"
];
function makeDefault() {
	return {
		extras: [],
		confirmBoost: {},
		gone: {},
		watch: { ...defaultWatch },
		prefs: {
			...defaultPrefs,
			regions: [...defaultPrefs.regions]
		},
		homeStoreId: null
	};
}
var serverState = makeDefault();
var clientState = null;
var listeners = /* @__PURE__ */ new Set();
function isPriority(v) {
	return v === "unicorn" || v === "want" || v === "curious";
}
function isRegion(v) {
	return v === "dc" || v === "md" || v === "va";
}
function sanitize(raw) {
	if (!raw || typeof raw !== "object") return null;
	const base = makeDefault();
	const data = raw;
	const watch = {};
	if (data.watch && typeof data.watch === "object") {
		for (const [id, priority] of Object.entries(data.watch)) if (isPriority(priority) && bottleById[id]) watch[id] = priority;
	}
	const regions = Array.isArray(data.prefs?.regions) ? data.prefs.regions.filter(isRegion) : base.prefs.regions;
	const prefs = {
		...base.prefs,
		...data.prefs ?? {},
		regions: regions.length ? [...new Set(regions)] : []
	};
	prefs.quietStart = clampHour(prefs.quietStart);
	prefs.quietEnd = clampHour(prefs.quietEnd);
	prefs.cooldownHours = [
		6,
		12,
		24
	].includes(prefs.cooldownHours) ? prefs.cooldownHours : 12;
	prefs.smsDailyCap = [
		1,
		3,
		5
	].includes(prefs.smsDailyCap) ? prefs.smsDailyCap : 3;
	prefs.freshWindowMin = [
		45,
		90,
		180
	].includes(prefs.freshWindowMin) ? prefs.freshWindowMin : 90;
	prefs.sms = Boolean(prefs.sms);
	prefs.email = Boolean(prefs.email);
	prefs.corroborationForSms = Boolean(prefs.corroborationForSms);
	const extras = Array.isArray(data.extras) ? data.extras.filter(isSighting) : [];
	const gone = {};
	if (data.gone && typeof data.gone === "object") {
		for (const [id, on] of Object.entries(data.gone)) if (on) gone[id] = true;
	}
	const confirmBoost = {};
	if (data.confirmBoost && typeof data.confirmBoost === "object") {
		for (const [id, n] of Object.entries(data.confirmBoost)) if (typeof n === "number" && n > 0 && n < 20) confirmBoost[id] = Math.round(n);
	}
	return {
		extras,
		confirmBoost,
		gone,
		watch,
		prefs,
		homeStoreId: typeof data.homeStoreId === "string" && storeById[data.homeStoreId] ? data.homeStoreId : null
	};
}
function isSighting(v) {
	if (!v || typeof v !== "object") return false;
	const s = v;
	return typeof s.id === "string" && typeof s.storeId === "string" && typeof s.bottleId === "string";
}
function clampHour(n) {
	if (!Number.isFinite(n)) return 0;
	return Math.min(23, Math.max(0, Math.round(n)));
}
function readStorage() {
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		return sanitize(JSON.parse(raw));
	} catch {
		return null;
	}
}
function getClientSnapshot() {
	if (!clientState) clientState = readStorage() ?? serverState;
	return clientState;
}
function getServerSnapshot() {
	return serverState;
}
function subscribe(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function commit(next) {
	clientState = next;
	try {
		localStorage.setItem(KEY, JSON.stringify(next));
	} catch {}
	for (const listener of listeners) listener();
}
function patch(mut) {
	commit(mut(getClientSnapshot()));
}
function useLore() {
	return (0, import_react.useSyncExternalStore)(subscribe, getClientSnapshot, getServerSnapshot);
}
function useNow() {
	const [now, setNow] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setNow(Date.now());
	}, []);
	return now;
}
function materialize(p) {
	const boosted = (s) => {
		const extra = p.confirmBoost[s.id] ?? 0;
		return extra ? {
			...s,
			confirms: s.confirms + extra
		} : s;
	};
	return [...p.extras.map(boosted), ...seedSightings.map(boosted)];
}
function addSightings(rows) {
	patch((p) => ({
		...p,
		extras: [...rows, ...p.extras]
	}));
}
function confirmSighting(id) {
	patch((p) => {
		if (p.gone[id]) return p;
		return {
			...p,
			confirmBoost: {
				...p.confirmBoost,
				[id]: (p.confirmBoost[id] ?? 0) + 1
			}
		};
	});
}
function markGone(id, gone) {
	patch((p) => {
		const next = { ...p.gone };
		if (gone) next[id] = true;
		else delete next[id];
		return {
			...p,
			gone: next
		};
	});
}
function setWatch(bottleId, priority) {
	patch((p) => {
		const watch = { ...p.watch };
		if (priority) watch[bottleId] = priority;
		else delete watch[bottleId];
		return {
			...p,
			watch
		};
	});
}
function setPrefs(prefs) {
	const regions = prefs.regions.filter((r) => REGIONS.includes(r));
	patch((p) => ({
		...p,
		prefs: {
			...prefs,
			regions
		}
	}));
}
function setHomeStore(id) {
	patch((p) => ({
		...p,
		homeStoreId: id && storeById[id] ? id : null
	}));
}
function resetDevice() {
	commit(makeDefault());
	try {
		localStorage.removeItem(KEY);
	} catch {}
}
//#endregion
export { storeById as _, kindLabel as a, useLore as b, placementLabel as c, regionMeta as d, resetDevice as f, sourceLabel as g, setWatch as h, confirmSighting as i, priorityHint as l, setPrefs as m, bottleById as n, markGone as o, setHomeStore as p, bottles as r, materialize as s, addSightings as t, priorityLabel as u, stores as v, useNow as x, tierLabel as y };
