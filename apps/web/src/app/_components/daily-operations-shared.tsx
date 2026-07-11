"use client";

import { type LucideIcon } from "lucide-react";

export type LoadState = "idle" | "loading" | "ready" | "error";

export type Resident = {
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
  status: string;
};

export type NightStatusRow = {
  resident: Resident;
  status: {
    checkedAt: string | null;
    note?: string;
    status: string;
  };
};

export type SOSAlert = {
  createdAt?: string;
  guardianAlertEnabled: boolean;
  id: string;
  message: string;
  residentId: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "FALSE_ALARM";
};

export type GuardianDashboard = {
  complaints: Array<{ id: string; status: string; title: string }>;
  food: Array<{ id: string; items: string[]; mealType: string; timing: string }>;
  guardian: { name: string; phone: string; relation: string };
  hostel: { name: string } | null;
  notices: Array<{ content: string; id: string; isUrgent: boolean; title: string }>;
  payments: Array<{
    dueAmount: number;
    id: string;
    month: string;
    paidAmount: number;
    status: string;
  }>;
  resident: Resident;
  safety: { checkedAt: string | null; status: string } | null;
  summary: { dueAmount: number; unpaidCount: number };
};

export type Review = {
  comment: string;
  id: string;
  overallRating: number;
  status: "VISIBLE" | "HIDDEN";
};

export type Notification = {
  body: string;
  id: string;
  isRead: boolean;
  title: string;
};

export function PageHeader({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="rounded-lg bg-muted p-3 text-primary">
        <Icon className="size-5" />
      </span>
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function field(form: FormData, name: string) {
  const value = form.get(name);

  return typeof value === "string" ? value.trim() : "";
}

export function optionalNumber(form: FormData, name: string) {
  const value = Number(field(form, name));

  return Number.isFinite(value) ? value : 0;
}

export function Message({ value }: { value: string }) {
  return value ? (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">{value}</div>
  ) : null;
}
