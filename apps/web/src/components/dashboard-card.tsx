import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardCardProps = {
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: string;
  title: string;
};

export function DashboardCard({
  action,
  children,
  className,
  contentClassName,
  description,
  title,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-surface shadow-sm dark:bg-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4 border-b border-border bg-muted/40 px-5 py-4 dark:bg-muted/20">
        <div>
          <h3 className="font-heading text-lg font-semibold text-primary">{title}</h3>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={cn("p-5", contentClassName)}>{children}</div>
    </section>
  );
}
