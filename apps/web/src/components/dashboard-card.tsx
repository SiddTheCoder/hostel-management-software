import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  title: string;
};

export function DashboardCard({ children, title }: DashboardCardProps) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h3 className="text-base font-bold text-primary">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}
