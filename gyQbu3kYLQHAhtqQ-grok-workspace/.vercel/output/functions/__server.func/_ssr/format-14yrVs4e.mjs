//#region node_modules/.nitro/vite/services/ssr/assets/format-14yrVs4e.js
function ageMinutes(s, now) {
	if (s.seenAt && now != null) {
		const t = Date.parse(s.seenAt);
		if (!Number.isNaN(t)) return Math.max(0, Math.round((now - t) / 6e4));
	}
	return s.ageMin;
}
function formatAge(mins) {
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins}m`;
	const hours = Math.round(mins / 60);
	if (hours < 24) return `${hours}h`;
	return `${Math.round(hours / 24)}d`;
}
function money(n) {
	if (n == null) return "—";
	return n.toLocaleString("en-US", {
		style: "currency",
		currency: "USD"
	});
}
function hourLabel(hour) {
	const h = (hour % 24 + 24) % 24;
	const suffix = h < 12 ? "a.m." : "p.m.";
	return `${h % 12 === 0 ? 12 : h % 12} ${suffix}`;
}
//#endregion
export { money as i, formatAge as n, hourLabel as r, ageMinutes as t };
