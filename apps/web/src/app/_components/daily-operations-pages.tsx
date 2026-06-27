"use client";

import { Bell, ClipboardCheck, Moon, ShieldCheck, Siren, Star } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

import {
  EmptyState,
  Input,
  LoadingRows,
  Panel,
  Select,
  StatusBadge,
  TextArea,
  currency,
} from "@/app/_components/hostel-admin-operations-pages";
import { browserApi } from "@/lib/browser-api";

type LoadState = "idle" | "loading" | "ready" | "error";

type Resident = {
  firstName: string;
  id: string;
  lastName: string;
  phone: string;
  status: string;
};

type NightStatusRow = {
  resident: Resident;
  status: {
    checkedAt: string | null;
    note?: string;
    status: string;
  };
};

type SOSAlert = {
  createdAt?: string;
  guardianAlertEnabled: boolean;
  id: string;
  message: string;
  residentId: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED" | "FALSE_ALARM";
};

type GuardianDashboard = {
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

type Review = {
  comment: string;
  id: string;
  overallRating: number;
  status: "VISIBLE" | "HIDDEN";
};

type Notification = {
  body: string;
  id: string;
  isRead: boolean;
  title: string;
};

function PageHeader({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: typeof Moon;
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

function field(form: FormData, name: string) {
  const value = form.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function optionalNumber(form: FormData, name: string) {
  const value = Number(field(form, name));

  return Number.isFinite(value) ? value : 0;
}

function Message({ value }: { value: string }) {
  return value ? (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">{value}</div>
  ) : null;
}

export function ResidentNightStatusPageContent() {
  const [status, setStatus] = useState<{
    checkedAt: string | null;
    status: string;
  } | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ status: NonNullable<typeof status> }>(
        "/api/v1/resident/night-status",
      );

      setStatus(data.status);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load status.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function update(statusValue: string) {
    try {
      await browserApi("/api/v1/resident/night-status", {
        body: JSON.stringify({ status: statusValue }),
        method: "POST",
      });
      setMessage("Night status updated.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update status.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Share a privacy-first safety status with hostel staff."
        icon={Moon}
        title="Night Status"
      />
      <Message value={message} />
      <Panel>
        <p className="text-sm text-muted-foreground">Current status</p>
        <p className="mt-2 text-3xl font-bold text-primary">
          {status?.status ?? "NOT_VERIFIED"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {status?.checkedAt ? new Date(status.checkedAt).toLocaleString() : "-"}
        </p>
      </Panel>
      <div className="grid gap-3 md:grid-cols-4">
        {["INSIDE_HOSTEL", "OUTSIDE_HOSTEL", "MARKED_SAFE", "NOT_VERIFIED"].map(
          (item) => (
            <button
              className="h-11 rounded-md bg-role-resident text-sm font-semibold text-white"
              key={item}
              onClick={() => void update(item)}
              type="button"
            >
              {item.replaceAll("_", " ")}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

export function HostelAdminNightStatusPage() {
  const [rows, setRows] = useState<NightStatusRow[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ statuses: NightStatusRow[] }>(
        "/api/v1/hostel-admin/night-status",
      );

      setRows(data.statuses);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load statuses.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function override(residentId: string, statusValue: string) {
    const reason = window.prompt("Override reason")?.trim();

    if (!reason) {
      return;
    }

    try {
      await browserApi(`/api/v1/hostel-admin/night-status/${residentId}/override`, {
        body: JSON.stringify({ reason, status: statusValue }),
        method: "PATCH",
      });
      setMessage("Status overridden.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not override status.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Status-only safety summary for residents in this hostel."
        icon={ShieldCheck}
        title="Night Status"
      />
      <Message value={message} />
      <Panel>
        {state === "loading" ? <LoadingRows /> : null}
        {state === "error" ? (
          <EmptyState label="Night status could not be loaded." />
        ) : null}
        {state === "ready" && rows.length === 0 ? (
          <EmptyState label="No residents." />
        ) : null}
        <div className="space-y-3">
          {rows.map((row) => (
            <div className="rounded-lg border border-border p-4" key={row.resident.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">
                    {row.resident.firstName} {row.resident.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{row.resident.phone}</p>
                </div>
                <StatusBadge>{row.status.status}</StatusBadge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["INSIDE_HOSTEL", "OUTSIDE_HOSTEL", "MARKED_SAFE"].map((item) => (
                  <button
                    className="rounded-md border border-role-admin px-3 py-2 text-sm font-semibold text-role-admin"
                    key={item}
                    onClick={() => void override(row.resident.id, item)}
                    type="button"
                  >
                    {item.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function ResidentSOSPageContent() {
  const [contacts, setContacts] = useState<
    Array<{ id: string; name: string; phone: string; relation: string }>
  >([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await browserApi<{ contacts: typeof contacts }>(
          "/api/v1/resident/emergency-contacts",
        );

        setContacts(data.contacts);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load contacts.");
      }
    }

    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function trigger(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/resident/sos", {
        body: JSON.stringify({
          guardianAlertEnabled: form.get("guardianAlertEnabled") === "on",
          message: field(form, "message"),
        }),
        method: "POST",
      });
      setMessage("SOS alert triggered.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not trigger SOS.");
    }
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        description="Trigger an emergency alert for hostel staff."
        icon={Siren}
        title="SOS"
      />
      <Message value={message} />
      <Panel title="Emergency Alert">
        <form className="grid gap-3" onSubmit={trigger}>
          <TextArea label="Message" name="message" />
          <label className="flex items-center gap-2 text-sm text-primary">
            <input name="guardianAlertEnabled" type="checkbox" />
            Alert guardian if enabled
          </label>
          <button className="h-11 rounded-md bg-rose-600 text-sm font-semibold text-white">
            Trigger SOS
          </button>
        </form>
      </Panel>
      <Panel title="Emergency Contacts">
        {contacts.length === 0 ? <EmptyState label="No emergency contacts." /> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {contacts.map((contact) => (
            <div className="rounded-lg border border-border p-4" key={contact.id}>
              <p className="font-semibold text-primary">{contact.name}</p>
              <p className="text-sm text-muted-foreground">
                {contact.relation} / {contact.phone}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function HostelAdminSOSAlertsPage() {
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ alerts: SOSAlert[] }>(
        "/api/v1/hostel-admin/sos-alerts",
      );

      setAlerts(data.alerts);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load SOS alerts.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function update(alertId: string, status: string) {
    try {
      await browserApi(`/api/v1/hostel-admin/sos-alerts/${alertId}/status`, {
        body: JSON.stringify({ status }),
        method: "PATCH",
      });
      setMessage("SOS alert updated.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update SOS alert.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Emergency alerts raised by residents."
        icon={Siren}
        title="SOS Alerts"
      />
      <Message value={message} />
      <Panel>
        {alerts.length === 0 ? <EmptyState label="No SOS alerts." /> : null}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div className="rounded-lg border border-border p-4" key={alert.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">
                    Resident {alert.residentId}
                  </p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <StatusBadge>{alert.status}</StatusBadge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {["ACKNOWLEDGED", "RESOLVED", "FALSE_ALARM"].map((item) => (
                  <button
                    className="rounded-md border border-role-admin px-3 py-2 text-sm font-semibold text-role-admin"
                    key={item}
                    onClick={() => void update(alert.id, item)}
                    type="button"
                  >
                    {item.replaceAll("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function HostelAdminMoveChecklistPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await browserApi<{ residents: Resident[] }>(
          "/api/v1/hostel-admin/residents",
        );

        setResidents(data.residents);
        setSelectedResidentId((current) => current || data.residents[0]?.id || "");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load residents.");
      }
    }

    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function moveIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi(`/api/v1/hostel-admin/residents/${selectedResidentId}/move-in`, {
        body: JSON.stringify({
          bedCondition: field(form, "bedCondition"),
          depositAmount: optionalNumber(form, "depositAmount"),
          documentsCollected: field(form, "documentsCollected")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          itemsProvided: field(form, "itemsProvided")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          roomCondition: field(form, "roomCondition"),
          roomPhotoAssetIds: field(form, "roomPhotoAssetIds")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          rulesAccepted: form.get("rulesAccepted") === "on",
        }),
        method: "POST",
      });
      setMessage("Move-in checklist saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save move-in.");
    }
  }

  async function moveOut(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi(`/api/v1/hostel-admin/residents/${selectedResidentId}/move-out`, {
        body: JSON.stringify({
          damageNotes: field(form, "damageNotes"),
          depositRefundAmount: optionalNumber(form, "depositRefundAmount"),
          depositRefundDecision: field(form, "depositRefundDecision"),
          finalReceiptAssetId: field(form, "finalReceiptAssetId"),
          itemReturnNotes: field(form, "itemReturnNotes"),
        }),
        method: "POST",
      });
      setMessage("Move-out checklist saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save move-out.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Record move-in condition and move-out settlement."
        icon={ClipboardCheck}
        title="Move-In/Move-Out"
      />
      <Message value={message} />
      <label className="grid max-w-md gap-2 text-sm font-semibold text-primary">
        Resident
        <select
          className="h-11 rounded-md border border-border bg-background px-3 text-sm font-normal outline-none focus:border-role-admin"
          onChange={(event) => setSelectedResidentId(event.target.value)}
          value={selectedResidentId}
        >
          {residents.map((resident) => (
            <option key={resident.id} value={resident.id}>
              {resident.firstName} {resident.lastName}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Move-In">
          <form className="grid gap-3" onSubmit={moveIn}>
            <Input label="Documents collected" name="documentsCollected" />
            <Input label="Room photo asset ids" name="roomPhotoAssetIds" />
            <Input label="Deposit amount" name="depositAmount" type="number" />
            <TextArea label="Room condition" name="roomCondition" />
            <TextArea label="Bed condition" name="bedCondition" />
            <Input label="Items provided" name="itemsProvided" />
            <label className="flex items-center gap-2 text-sm text-primary">
              <input name="rulesAccepted" type="checkbox" />
              Rules accepted
            </label>
            <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
              Save Move-In
            </button>
          </form>
        </Panel>
        <Panel title="Move-Out">
          <form className="grid gap-3" onSubmit={moveOut}>
            <TextArea label="Damage notes" name="damageNotes" />
            <TextArea label="Item return notes" name="itemReturnNotes" />
            <Input label="Refund amount" name="depositRefundAmount" type="number" />
            <Select label="Refund decision" name="depositRefundDecision">
              {["PENDING", "APPROVED", "PARTIAL", "FORFEITED"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <Input label="Final receipt asset id" name="finalReceiptAssetId" />
            <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
              Save Move-Out
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
}

export function GuardianDashboardPageContent() {
  const [dashboard, setDashboard] = useState<GuardianDashboard | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await browserApi<{ dashboard: GuardianDashboard }>(
          "/api/v1/guardian/dashboard",
        );

        setDashboard(data.dashboard);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Could not load guardian dashboard.",
        );
      }
    }

    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Limited resident summary for guardian access."
        icon={ShieldCheck}
        title="Guardian Dashboard"
      />
      <Message value={message} />
      {dashboard ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Panel>
              <p className="text-sm text-muted-foreground">Resident</p>
              <p className="mt-2 text-xl font-bold text-primary">
                {dashboard.resident.firstName} {dashboard.resident.lastName}
              </p>
            </Panel>
            <Panel>
              <p className="text-sm text-muted-foreground">Due</p>
              <p className="mt-2 text-xl font-bold text-primary">
                {currency(dashboard.summary.dueAmount)}
              </p>
            </Panel>
            <Panel>
              <p className="text-sm text-muted-foreground">Safety</p>
              <p className="mt-2 text-xl font-bold text-primary">
                {dashboard.safety?.status ?? "NOT_VERIFIED"}
              </p>
            </Panel>
            <Panel>
              <p className="text-sm text-muted-foreground">Hostel</p>
              <p className="mt-2 text-xl font-bold text-primary">
                {dashboard.hostel?.name ?? "-"}
              </p>
            </Panel>
          </div>
          <div className="grid gap-5 xl:grid-cols-3">
            <Panel title="Payments">
              {dashboard.payments.map((payment) => (
                <p className="py-1 text-sm" key={payment.id}>
                  {payment.month}: {payment.status}
                </p>
              ))}
            </Panel>
            <Panel title="Notices">
              {dashboard.notices.map((notice) => (
                <p className="py-1 text-sm" key={notice.id}>
                  {notice.title}
                </p>
              ))}
            </Panel>
            <Panel title="Food">
              {dashboard.food.map((menu) => (
                <p className="py-1 text-sm" key={menu.id}>
                  {menu.mealType}: {menu.items.join(", ")}
                </p>
              ))}
            </Panel>
          </div>
        </>
      ) : null}
    </div>
  );
}

export function ResidentReviewsPageContent() {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/resident/reviews", {
        body: JSON.stringify({
          cleanlinessRating: optionalNumber(form, "cleanlinessRating"),
          comment: field(form, "comment"),
          foodRating: optionalNumber(form, "foodRating"),
          overallRating: optionalNumber(form, "overallRating"),
          safetyRating: optionalNumber(form, "safetyRating"),
        }),
        method: "POST",
      });
      setMessage("Review submitted.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit review.");
    }
  }

  return (
    <div className="mx-auto max-w-[760px] space-y-6">
      <PageHeader description="Verified hostel review." icon={Star} title="Reviews" />
      <Message value={message} />
      <Panel>
        <form className="grid gap-3" onSubmit={submit}>
          <Input label="Overall rating" name="overallRating" required type="number" />
          <Input label="Food rating" name="foodRating" type="number" />
          <Input label="Safety rating" name="safetyRating" type="number" />
          <Input label="Cleanliness rating" name="cleanlinessRating" type="number" />
          <TextArea label="Comment" name="comment" />
          <button className="h-11 rounded-md bg-role-resident text-sm font-semibold text-white">
            Submit Review
          </button>
        </form>
      </Panel>
    </div>
  );
}

export function PlatformReviewsPageContent() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ reviews: Review[] }>("/api/v1/platform/reviews");

      setReviews(data.reviews);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load reviews.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function moderate(reviewId: string, action: "hide" | "unhide") {
    try {
      await browserApi(`/api/v1/platform/reviews/${reviewId}/${action}`, {
        body: JSON.stringify({}),
        method: "PATCH",
      });
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not moderate review.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader description="Review moderation queue." icon={Star} title="Reviews" />
      <Message value={message} />
      <Panel>
        {reviews.length === 0 ? <EmptyState label="No reviews." /> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {reviews.map((review) => (
            <div className="rounded-lg border border-border p-4" key={review.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-primary">
                  {review.overallRating}/5 review
                </p>
                <StatusBadge>{review.status}</StatusBadge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              <div className="mt-3 flex gap-2">
                <button
                  className="rounded-md border px-3 py-2 text-sm font-semibold"
                  onClick={() => void moderate(review.id, "hide")}
                  type="button"
                >
                  Hide
                </button>
                <button
                  className="rounded-md border px-3 py-2 text-sm font-semibold"
                  onClick={() => void moderate(review.id, "unhide")}
                  type="button"
                >
                  Unhide
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function NotificationsPageContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ notifications: Notification[] }>(
        "/api/v1/notifications",
      );

      setNotifications(data.notifications);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load notifications.",
      );
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function markRead(id: string) {
    try {
      await browserApi(`/api/v1/notifications/${id}/read`, {
        body: JSON.stringify({}),
        method: "PATCH",
      });
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not mark read.");
    }
  }

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        description="In-app notification feed."
        icon={Bell}
        title="Notifications"
      />
      <Message value={message} />
      <Panel>
        {notifications.length === 0 ? <EmptyState label="No notifications." /> : null}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div className="rounded-lg border border-border p-4" key={notification.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">{notification.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.body}
                  </p>
                </div>
                {notification.isRead ? (
                  <StatusBadge>READ</StatusBadge>
                ) : (
                  <button
                    className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                    onClick={() => void markRead(notification.id)}
                    type="button"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
