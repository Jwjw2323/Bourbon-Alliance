import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Plus, Rows3, Store, Wine } from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { to: "/", label: "Board", icon: Rows3 },
  { to: "/stores", label: "Stores", icon: Store },
  { to: "/report", label: "Report", icon: Plus },
  { to: "/bottles", label: "Bottles", icon: Wine },
  { to: "/alerts", label: "Alerts", icon: Bell },
] as const;

function isActive(path: string, to: string) {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-line bg-bg">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4">
          <Link to="/" className="font-display text-xl tracking-tight text-ink">
            Lore
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {items.map((item) => {
              const active = isActive(path, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    active ? "bg-chip text-ink" : "text-muted",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link to="/how" className="text-sm text-muted">
            How it works
          </Link>
        </div>
      </header>
      {children}
      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface pb-safe md:hidden"
        aria-label="Primary"
      >
        <ul className="grid grid-cols-5">
          {items.map((item) => {
            const active = isActive(path, item.to);
            const Icon = item.icon;
            const report = item.to === "/report";
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
                    active ? "text-ink" : "text-muted",
                  )}
                >
                  {report ? (
                    <span className="-mt-5 grid size-11 place-items-center rounded-full bg-accent text-accent-fg">
                      <Plus className="size-5" aria-hidden="true" />
                    </span>
                  ) : (
                    <Icon className="size-5" aria-hidden="true" />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
