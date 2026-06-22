import Link from "next/link";
import type { ReactNode } from "react";

import { PortalAccount } from "@/components/portal-account";

type NavItem = {
  href: string;
  label: string;
};

type PortalShellProps = {
  children: ReactNode;
  navItems: NavItem[];
  portalName: string;
  subtitle: string;
};

export function PortalShell({
  children,
  navItems,
  portalName,
  subtitle,
}: PortalShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="bg-primary px-5 py-6 text-white">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold">
          <span className="flex size-9 items-center justify-center rounded-lg bg-secondary">
            H
          </span>
          HostelHub
        </Link>
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {subtitle}
          </p>
          <h1 className="mt-2 text-2xl font-bold">{portalName}</h1>
        </div>
        <nav className="mt-8 grid gap-2">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                index === 0
                  ? "bg-secondary text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-secondary">Dashboard</p>
            <h2 className="text-2xl font-bold text-primary">{portalName}</h2>
          </div>
          <PortalAccount />
        </header>
        <main className="px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
