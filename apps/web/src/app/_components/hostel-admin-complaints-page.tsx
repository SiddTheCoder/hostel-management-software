"use client";

import { MessageSquareWarning } from "lucide-react";
import { memo, useCallback, useEffect, useState, type FormEvent } from "react";

import {
  EmptyState,
  LoadingRows,
  Panel,
  StatusBadge,
} from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";

import {
  field,
  optionalField,
  PageHeader,
  type Complaint,
  type ComplaintSummary,
  type LoadState,
} from "./hostel-admin-shared";

export const HostelAdminComplaintsPage = memo(function HostelAdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [summary, setSummary] = useState<ComplaintSummary>({
    inProgress: 0,
    overdue: 0,
    pending: 0,
    rejected: 0,
    resolved: 0,
    total: 0,
  });
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filter, setFilter] = useState("");
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const params = new URLSearchParams();

      if (filter) {
        params.set("status", filter);
      }

      if (categoryFilter) {
        params.set("category", categoryFilter);
      }

      const data = await browserApi<{
        complaints: Complaint[];
        summary: ComplaintSummary;
      }>(
        `/api/v1/hostel-admin/complaints${
          params.size > 0 ? `?${params.toString()}` : ""
        }`,
      );

      setComplaints(data.complaints);
      setSummary(data.summary);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load complaints.");
      setState("error");
    }
  }, [categoryFilter, filter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const handleReply = useCallback(
    async (event: FormEvent<HTMLFormElement>, complaintId: string) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const reply = field(form, "message");

      if (!reply) {
        setMessage("Reply message is required.");
        return;
      }

      try {
        await browserApi(`/api/v1/hostel-admin/complaints/${complaintId}/reply`, {
          body: JSON.stringify({ message: reply }),
          method: "POST",
        });
        event.currentTarget.reset();
        setMessage("Reply saved.");
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not save reply.");
      }
    },
    [load],
  );

  const handleStatus = useCallback(
    async (event: FormEvent<HTMLFormElement>, complaintId: string) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);

      try {
        await browserApi(`/api/v1/hostel-admin/complaints/${complaintId}/status`, {
          body: JSON.stringify({
            response: optionalField(form, "response"),
            status: field(form, "status"),
          }),
          method: "PATCH",
        });
        setMessage("Complaint status updated.");
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not update status.");
      }
    },
    [load],
  );

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        action={
          <div className="flex flex-wrap gap-2">
            <select
              className="h-11 rounded-md border border-border bg-background px-3 text-sm"
              onChange={(event) => setFilter(event.target.value)}
              value={filter}
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              className="h-11 rounded-md border border-border bg-background px-3 text-sm"
              onChange={(event) => setCategoryFilter(event.target.value)}
              value={categoryFilter}
            >
              <option value="">All categories</option>
              {[
                "FOOD",
                "ROOM",
                "MAINTENANCE",
                "SAFETY",
                "PAYMENT",
                "STAFF",
                "NOISE",
                "OTHER",
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        }
        description="Triage resident issues, reply privately, and track SLA pressure."
        icon={MessageSquareWarning}
        title="Complaints"
      />

      {message ? (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          {message}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-5">
        {(
          [
            ["Total", summary.total],
            ["Pending", summary.pending],
            ["In Progress", summary.inProgress],
            ["Overdue", summary.overdue],
            ["Resolved", summary.resolved],
          ] as const
        ).map(([label, value]) => (
          <Panel key={label}>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          </Panel>
        ))}
      </div>

      <Panel title="Complaint Queue">
        {state === "loading" ? <LoadingRows /> : null}
        {state === "error" ? (
          <EmptyState label="Complaints could not be loaded." />
        ) : null}
        {state === "ready" && complaints.length === 0 ? (
          <EmptyState label="No complaints in this queue." />
        ) : null}
        <div className="grid gap-4 xl:grid-cols-2">
          {complaints.map((complaint) => (
            <div className="rounded-lg border border-border p-4" key={complaint.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{complaint.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {complaint.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge>{complaint.status}</StatusBadge>
                  <StatusBadge>{complaint.category}</StatusBadge>
                  {complaint.isOverdue ? <StatusBadge>OVERDUE</StatusBadge> : null}
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                <span>
                  Resident: {complaint.isAnonymous ? "Anonymous" : complaint.residentId}
                </span>
                <span>SLA: {new Date(complaint.slaDueAt).toLocaleString()}</span>
                <span>
                  Attachments:{" "}
                  {complaint.attachments.length > 0
                    ? complaint.attachments.map((item) => item.fileAssetId).join(", ")
                    : "None"}
                </span>
              </div>

              {complaint.adminResponse ? (
                <div className="mt-4 rounded-md bg-muted p-3 text-sm text-foreground">
                  {complaint.adminResponse}
                </div>
              ) : null}

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <form
                  className="grid gap-2"
                  onSubmit={(event) => handleReply(event, complaint.id)}
                >
                  <textarea
                    className="min-h-20 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-role-admin"
                    name="message"
                    placeholder="Reply to resident"
                  />
                  <button className="h-10 rounded-md border border-role-admin px-3 text-sm font-semibold text-role-admin">
                    Save Reply
                  </button>
                </form>
                <form
                  className="grid gap-2"
                  onSubmit={(event) => handleStatus(event, complaint.id)}
                >
                  <select
                    className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                    defaultValue={complaint.status}
                    name="status"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <textarea
                    className="min-h-20 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-role-admin"
                    name="response"
                    placeholder="Optional response"
                  />
                  <button className="h-10 rounded-md bg-role-admin px-3 text-sm font-semibold text-white">
                    Update Status
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
});
