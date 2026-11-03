import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Page({
  children,
  width = "board",
}: {
  children: ReactNode;
  width?: "board" | "narrow";
}) {
  return (
    <main
      className={cn(
        "mx-auto w-full px-4 pt-6 pb-28 md:pb-16",
        width === "board" ? "max-w-3xl" : "max-w-lg",
      )}
    >
      {children}
    </main>
  );
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "line" | "ghost";
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors duration-150 disabled:opacity-40",
        variant === "primary" && "bg-accent text-accent-fg",
        variant === "line" && "border border-line bg-surface text-ink",
        variant === "ghost" && "text-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Chip({
  on,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { on?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-3 text-sm transition-colors duration-150",
        on ? "border-ink bg-ink text-bg" : "border-line bg-transparent text-muted",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      {children}
    </label>
  );
}

export const fieldClass =
  "h-11 w-full rounded-md border border-line bg-surface px-3 text-base text-ink placeholder:text-muted";
