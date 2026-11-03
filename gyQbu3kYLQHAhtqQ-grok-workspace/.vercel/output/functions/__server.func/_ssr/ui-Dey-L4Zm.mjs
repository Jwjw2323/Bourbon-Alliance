import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as cn } from "./router-uWSldKuA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-Dey-L4Zm.js
var import_jsx_runtime = require_jsx_runtime();
function Page({ children, width = "board" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: cn("mx-auto w-full px-4 pt-6 pb-28 md:pb-16", width === "board" ? "max-w-3xl" : "max-w-lg"),
		children
	});
}
function Button({ variant = "primary", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-150 disabled:opacity-40", variant === "primary" && "bg-accent text-accent-fg", variant === "line" && "border border-line bg-surface text-ink", variant === "ghost" && "text-ink", className),
		...props
	});
}
function Chip({ on, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("inline-flex h-9 items-center rounded-full border px-3 text-sm transition-colors duration-150", on ? "border-ink bg-ink text-bg" : "border-line bg-transparent text-muted"),
		...props,
		children
	});
}
var fieldClass = "h-11 w-full rounded-md border border-line bg-surface px-3 text-base text-ink placeholder:text-muted";
//#endregion
export { fieldClass as i, Chip as n, Page as r, Button as t };
