import { t as ageMinutes } from "./format-14yrVs4e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alerts-D9yH7mOT.js
var PREVIEW_CLOCK = "8:12 a.m.";
function isQuiet(hour, start, end) {
	if (start === end) return false;
	if (start < end) return hour >= start && hour < end;
	return hour >= start || hour < end;
}
function corroborated(s) {
	return s.confirms >= 2 || s.source !== "hunter";
}
function decideOne(args) {
	const { sighting, bottle, store, prefs, priority, gone, hour, now } = args;
	if (!priority) return {
		channel: "drop",
		reason: "Not on your list"
	};
	if (!prefs.regions.includes(store.region)) return {
		channel: "drop",
		reason: "Outside the regions you hunt"
	};
	if (gone) return {
		channel: "drop",
		reason: "Marked gone"
	};
	if (priority === "curious") return {
		channel: "board",
		reason: "Curious stays on the board — no ping"
	};
	const fresh = ageMinutes(sighting, now) <= prefs.freshWindowMin;
	const quiet = isQuiet(hour, prefs.quietStart, prefs.quietEnd);
	const backed = corroborated(sighting);
	if (!fresh && bottle.tier !== "shelf") {
		if (prefs.email) return {
			channel: "digest",
			reason: `Older than ${prefs.freshWindowMin}m — morning note, not a text`
		};
		return {
			channel: "drop",
			reason: `Older than ${prefs.freshWindowMin}m`
		};
	}
	if (priority === "want") {
		if (!prefs.email) return {
			channel: "board",
			reason: "Want list, email off — board only"
		};
		return {
			channel: "digest",
			reason: "Want list rides the morning note"
		};
	}
	if (prefs.corroborationForSms && !backed) {
		if (prefs.email) return {
			channel: "email",
			reason: "One hunter so far — email, not a text"
		};
		return {
			channel: "board",
			reason: "Waiting on a second hunter"
		};
	}
	if (!prefs.sms && prefs.email) return quiet ? {
		channel: "digest",
		reason: "Quiet hours — held for the morning note"
	} : {
		channel: "email",
		reason: "Texts off — email only"
	};
	if (!prefs.sms && !prefs.email) return {
		channel: "board",
		reason: "Alerts off — board only"
	};
	if (quiet) return {
		channel: "digest",
		reason: "Quiet hours — the text waits until morning"
	};
	if (sighting.source !== "hunter") return {
		channel: "sms",
		reason: "Fresh published count, on your unicorn list"
	};
	return {
		channel: "sms",
		reason: "Fresh, backed by two hunters, on your unicorn list"
	};
}
function planAlerts(args) {
	const storesById = new Map(args.stores.map((s) => [s.id, s]));
	const bottlesById = new Map(args.bottles.map((b) => [b.id, b]));
	const sorted = [...args.sightings].sort((a, b) => ageMinutes(a, args.now) - ageMinutes(b, args.now));
	const planned = [];
	const alertedPair = /* @__PURE__ */ new Map();
	let smsCount = 0;
	for (const sighting of sorted) {
		const store = storesById.get(sighting.storeId);
		const bottle = bottlesById.get(sighting.bottleId);
		if (!store || !bottle) continue;
		let decision = decideOne({
			sighting,
			bottle,
			store,
			prefs: args.prefs,
			priority: args.watch[bottle.id],
			gone: Boolean(args.gone[sighting.id]),
			hour: args.hour,
			now: args.now
		});
		const pair = `${sighting.storeId}:${sighting.bottleId}`;
		if (decision.channel === "sms" || decision.channel === "email" || decision.channel === "digest") {
			const prev = alertedPair.get(pair);
			const age = ageMinutes(sighting, args.now);
			if (prev != null && Math.abs(age - prev) / 60 < args.prefs.cooldownHours) decision = {
				channel: "drop",
				reason: "Same bottle, same store, inside the cooldown"
			};
			else alertedPair.set(pair, age);
		}
		if (decision.channel === "sms") {
			smsCount += 1;
			if (smsCount > args.prefs.smsDailyCap) decision = {
				channel: "digest",
				reason: `Daily text cap is ${args.prefs.smsDailyCap} — rolled into the morning note`
			};
		}
		planned.push({
			sighting,
			bottle,
			store,
			decision
		});
	}
	return planned;
}
//#endregion
export { planAlerts as n, PREVIEW_CLOCK as t };
