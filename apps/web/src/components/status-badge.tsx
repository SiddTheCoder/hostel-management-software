import type { ReactNode } from "react";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "neutral";
};

const toneClassName = {
  success: "bg-emerald-100 text-secondary",
  warning: "bg-amber-100 text-warning",
  danger: "bg-red-100 text-danger",
  neutral: "bg-slate-100 text-muted-foreground",
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${toneClassName[tone]}`}>
      {children}
    </span>
  );
}
