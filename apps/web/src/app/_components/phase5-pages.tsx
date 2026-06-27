"use client";

import {
  BarChart3,
  Flag,
  Gift,
  Search,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
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

type ServiceProvider = {
  area: string;
  availability: string;
  category: string;
  description: string;
  experience: string;
  fullName: string;
  id: string;
  phone: string;
  status: string;
};

type MaintenanceRequest = {
  category: string;
  comments?: Array<{ id: string; message: string }>;
  costNote: string;
  description: string;
  id: string;
  priority: string;
  providerId?: string;
  status: string;
  title: string;
};

type Referral = {
  id: string;
  name: string;
  phone: string;
  reward?: { amount: number; status: string } | null;
  status: string;
};

type ListingFlag = {
  hostelId: string;
  id: string;
  matchedHostelIds: string[];
  reason: string;
  riskLevel: string;
  signals: string[];
  status: string;
};

type ReportRecord = Record<string, unknown>;

function field(form: FormData, name: string) {
  const value = form.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function optionalField(form: FormData, name: string) {
  const value = field(form, name);

  return value.length > 0 ? value : undefined;
}

function optionalNumber(form: FormData, name: string) {
  const value = field(form, name);

  return value ? Number(value) : 0;
}

function Message({ value }: { value: string }) {
  return value ? (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">{value}</div>
  ) : null;
}

function PageHeader({
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

function ReportGrid({ report }: { report: ReportRecord | null }) {
  if (!report) {
    return <EmptyState label="Report data is not loaded." />;
  }

  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-4">
      {Object.entries(report).map(([key, value]) => (
        <Panel key={key}>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            {key.replace(/([A-Z])/g, " $1")}
          </p>
          <p className="mt-2 break-words text-2xl font-bold text-primary">
            {typeof value === "number"
              ? key.toLowerCase().includes("amount") || key.toLowerCase().includes("dues")
                ? currency(value)
                : value.toLocaleString()
              : typeof value === "object"
                ? JSON.stringify(value)
                : String(value)}
          </p>
        </Panel>
      ))}
    </div>
  );
}

export function PlatformServiceProvidersPageContent() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ providers: ServiceProvider[] }>(
        "/api/v1/platform/service-providers",
      );

      setProviders(data.providers);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load providers.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function moderate(providerId: string, action: "approve" | "hide" | "reject") {
    const reason =
      action === "reject" ? window.prompt("Rejection reason")?.trim() : undefined;

    if (action === "reject" && !reason) {
      return;
    }

    try {
      await browserApi(`/api/v1/platform/service-providers/${providerId}/${action}`, {
        body: JSON.stringify(reason ? { reason } : {}),
        method: "PATCH",
      });
      setMessage(`Provider ${action}d.`);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update provider.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Review local workers before hostel admins can contact them."
        icon={Users}
        title="Service Providers"
      />
      <Message value={message} />
      <Panel>
        {state === "loading" ? <LoadingRows /> : null}
        {state === "error" ? <EmptyState label="Providers could not be loaded." /> : null}
        {state === "ready" && providers.length === 0 ? (
          <EmptyState label="No service provider applications." />
        ) : null}
        <div className="grid gap-3 xl:grid-cols-2">
          {providers.map((provider) => (
            <div className="rounded-lg border border-border p-4" key={provider.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">{provider.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {provider.category.replaceAll("_", " ")} / {provider.area}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{provider.phone}</p>
                </div>
                <StatusBadge>{provider.status}</StatusBadge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {provider.description || provider.availability || "-"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="rounded-md bg-role-platform px-3 py-2 text-sm font-semibold text-white"
                  onClick={() => void moderate(provider.id, "approve")}
                  type="button"
                >
                  Approve
                </button>
                <button
                  className="rounded-md border border-border px-3 py-2 text-sm font-semibold"
                  onClick={() => void moderate(provider.id, "reject")}
                  type="button"
                >
                  Reject
                </button>
                <button
                  className="rounded-md border border-border px-3 py-2 text-sm font-semibold"
                  onClick={() => void moderate(provider.id, "hide")}
                  type="button"
                >
                  Hide
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function HostelAdminServiceProvidersPageContent() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ providers: ServiceProvider[] }>(
        "/api/v1/hostel-admin/service-providers",
      );

      setProviders(data.providers);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load providers.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Approved local providers available for hostel maintenance."
        icon={Search}
        title="Service Provider Search"
      />
      <Message value={message} />
      <Panel>
        {state === "loading" ? <LoadingRows /> : null}
        {state === "error" ? <EmptyState label="Providers could not be loaded." /> : null}
        {state === "ready" && providers.length === 0 ? (
          <EmptyState label="No approved providers." />
        ) : null}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {providers.map((provider) => (
            <div className="rounded-lg border border-border p-4" key={provider.id}>
              <p className="font-semibold text-primary">{provider.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {provider.category.replaceAll("_", " ")} / {provider.area}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{provider.phone}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {provider.availability || provider.description || "-"}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function HostelAdminMaintenancePageContent() {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const [providerData, requestData] = await Promise.all([
        browserApi<{ providers: ServiceProvider[] }>(
          "/api/v1/hostel-admin/service-providers",
        ),
        browserApi<{ requests: MaintenanceRequest[] }>(
          "/api/v1/hostel-admin/maintenance/requests",
        ),
      ]);

      setProviders(providerData.providers);
      setRequests(requestData.requests);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load maintenance.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/hostel-admin/maintenance/requests", {
        body: JSON.stringify({
          category: field(form, "category"),
          costNote: optionalField(form, "costNote"),
          description: optionalField(form, "description"),
          priority: field(form, "priority"),
          providerId: optionalField(form, "providerId"),
          title: field(form, "title"),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setMessage("Maintenance request created.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create request.");
    }
  }

  async function updateStatus(requestId: string, status: string) {
    try {
      await browserApi(`/api/v1/hostel-admin/maintenance/requests/${requestId}/status`, {
        body: JSON.stringify({ status }),
        method: "PATCH",
      });
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update request.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Create and track hostel repair work with approved providers."
        icon={Wrench}
        title="Maintenance"
      />
      <Message value={message} />
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="Requests">
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? (
            <EmptyState label="Requests could not be loaded." />
          ) : null}
          {state === "ready" && requests.length === 0 ? (
            <EmptyState label="No maintenance requests." />
          ) : null}
          <div className="space-y-3">
            {requests.map((request) => (
              <div className="rounded-lg border border-border p-4" key={request.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{request.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.category.replaceAll("_", " ")} / {request.priority}
                    </p>
                  </div>
                  <StatusBadge>{request.status}</StatusBadge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {request.description || request.costNote || "-"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["CONTACTED", "SCHEDULED", "COMPLETED", "CANCELLED"].map((status) => (
                    <button
                      className="rounded-md border border-role-admin px-3 py-2 text-sm font-semibold text-role-admin"
                      key={status}
                      onClick={() => void updateStatus(request.id, status)}
                      type="button"
                    >
                      {status.replaceAll("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="New Request">
          <form className="grid gap-3" onSubmit={create}>
            <Input label="Title" name="title" required />
            <Select label="Category" name="category" required>
              {[
                "PLUMBING",
                "ELECTRICAL",
                "INTERNET",
                "CLEANING",
                "CARPENTRY",
                "PAINTING",
                "WATER",
                "APPLIANCE",
                "ROOM_REPAIR",
                "HEALTH",
                "OTHER",
              ].map((category) => (
                <option key={category} value={category}>
                  {category.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
            <Select label="Priority" name="priority">
              {["LOW", "MEDIUM", "HIGH", "URGENT"].map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </Select>
            <Select label="Provider" name="providerId">
              <option value="">Manual contact later</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.fullName} / {provider.category.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
            <TextArea label="Description" name="description" />
            <Input label="Cost note" name="costNote" />
            <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
              Create Request
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
}

export function ResidentReferralPageContent() {
  const [referralCode, setReferralCode] = useState<{
    code: string;
    joinedCount: number;
    link: string;
    rewardCount: number;
  } | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await browserApi<{
          referralCode: NonNullable<typeof referralCode>;
          referrals: Referral[];
        }>("/api/v1/resident/referral");

        setReferralCode(data.referralCode);
        setReferrals(data.referrals);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load referral.");
      }
    }

    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        description="Share your referral code with a friend joining the hostel."
        icon={Gift}
        title="Referral"
      />
      <Message value={message} />
      <Panel title="Your Code">
        {referralCode ? (
          <div>
            <p className="font-mono text-4xl font-bold tracking-widest text-role-resident">
              {referralCode.code}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {referralCode.link} / Joined {referralCode.joinedCount} / Rewards{" "}
              {referralCode.rewardCount}
            </p>
          </div>
        ) : (
          <EmptyState label="Referral code is not loaded." />
        )}
      </Panel>
      <Panel title="Referred Inquiries">
        {referrals.length === 0 ? <EmptyState label="No referrals yet." /> : null}
        <div className="space-y-3">
          {referrals.map((referral) => (
            <div className="rounded-lg border border-border p-4" key={referral.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">{referral.name}</p>
                  <p className="text-sm text-muted-foreground">{referral.phone}</p>
                </div>
                <StatusBadge>{referral.status}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function HostelAdminReferralsPageContent() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ referrals: Referral[] }>(
        "/api/v1/hostel-admin/referrals",
      );

      setReferrals(data.referrals);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load referrals.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function confirm(event: FormEvent<HTMLFormElement>, referralId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi(`/api/v1/hostel-admin/referrals/${referralId}/confirm`, {
        body: JSON.stringify({
          rewardAmount: optionalNumber(form, "rewardAmount"),
          rewardNotes: optionalField(form, "rewardNotes"),
        }),
        method: "PATCH",
      });
      setMessage("Referral confirmed.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not confirm referral.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Confirm referred residents who joined and track rewards."
        icon={Gift}
        title="Referrals"
      />
      <Message value={message} />
      <Panel>
        {referrals.length === 0 ? <EmptyState label="No referrals." /> : null}
        <div className="grid gap-3 xl:grid-cols-2">
          {referrals.map((referral) => (
            <div className="rounded-lg border border-border p-4" key={referral.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">{referral.name}</p>
                  <p className="text-sm text-muted-foreground">{referral.phone}</p>
                </div>
                <StatusBadge>{referral.status}</StatusBadge>
              </div>
              <form
                className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
                onSubmit={(event) => confirm(event, referral.id)}
              >
                <input
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                  name="rewardAmount"
                  placeholder="Reward amount"
                  type="number"
                />
                <input
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                  name="rewardNotes"
                  placeholder="Reward notes"
                />
                <button className="h-10 rounded-md bg-role-admin px-3 text-sm font-semibold text-white">
                  Confirm
                </button>
              </form>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function PlatformListingFlagsPageContent() {
  const [flags, setFlags] = useState<ListingFlag[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ flags: ListingFlag[] }>(
        "/api/v1/platform/listing-flags",
      );

      setFlags(data.flags);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load flags.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function runCheck(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const hostelId = field(form, "hostelId");

    try {
      await browserApi(`/api/v1/platform/hostels/${hostelId}/run-duplicate-check`, {
        body: JSON.stringify({}),
        method: "POST",
      });
      setMessage("Duplicate check completed.");
      event.currentTarget.reset();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not run check.");
    }
  }

  async function resolve(flagId: string, status: "DISMISSED" | "RESOLVED") {
    const resolutionNote = window.prompt("Resolution note")?.trim();

    if (!resolutionNote) {
      return;
    }

    try {
      await browserApi(`/api/v1/platform/listing-flags/${flagId}/resolve`, {
        body: JSON.stringify({ resolutionNote, status }),
        method: "PATCH",
      });
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not resolve flag.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Manual duplicate and ghost-listing checks for hostel records."
        icon={Flag}
        title="Abuse Flags"
      />
      <Message value={message} />
      <Panel title="Run Duplicate Check">
        <form className="flex flex-wrap gap-3" onSubmit={runCheck}>
          <input
            className="h-11 min-w-80 rounded-md border border-border bg-background px-3 text-sm"
            name="hostelId"
            placeholder="Hostel id"
            required
          />
          <button className="rounded-md bg-role-platform px-4 py-2 text-sm font-semibold text-white">
            Run Check
          </button>
        </form>
      </Panel>
      <Panel title="Flags">
        {flags.length === 0 ? <EmptyState label="No listing flags." /> : null}
        <div className="space-y-3">
          {flags.map((flag) => (
            <div className="rounded-lg border border-border p-4" key={flag.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">{flag.reason}</p>
                  <p className="text-sm text-muted-foreground">
                    Hostel {flag.hostelId} / Matches {flag.matchedHostelIds.length}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {flag.signals.join(", ") || "No duplicate signal"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <StatusBadge>{flag.riskLevel}</StatusBadge>
                  <StatusBadge>{flag.status}</StatusBadge>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  className="rounded-md border px-3 py-2 text-sm font-semibold"
                  onClick={() => void resolve(flag.id, "RESOLVED")}
                  type="button"
                >
                  Resolve
                </button>
                <button
                  className="rounded-md border px-3 py-2 text-sm font-semibold"
                  onClick={() => void resolve(flag.id, "DISMISSED")}
                  type="button"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function PlatformReportsPageContent() {
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await browserApi<{ report: ReportRecord }>(
          "/api/v1/platform/reports/dashboard",
        );

        setReport(data.report);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load report.");
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
        description="Platform-wide pilot readiness metrics."
        icon={BarChart3}
        title="Reports"
      />
      <Message value={message} />
      <ReportGrid report={report} />
    </div>
  );
}

export function HostelAdminReportsPageContent() {
  const [dashboard, setDashboard] = useState<ReportRecord | null>(null);
  const [payments, setPayments] = useState<ReportRecord | null>(null);
  const [complaints, setComplaints] = useState<ReportRecord | null>(null);
  const [maintenance, setMaintenance] = useState<ReportRecord | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [dashboardData, paymentsData, complaintsData, maintenanceData] =
          await Promise.all([
            browserApi<{ report: ReportRecord }>(
              "/api/v1/hostel-admin/reports/dashboard",
            ),
            browserApi<{ report: ReportRecord }>("/api/v1/hostel-admin/reports/payments"),
            browserApi<{ report: ReportRecord }>(
              "/api/v1/hostel-admin/reports/complaints",
            ),
            browserApi<{ report: ReportRecord }>(
              "/api/v1/hostel-admin/reports/maintenance",
            ),
          ]);

        setDashboard(dashboardData.report);
        setPayments(paymentsData.report);
        setComplaints(complaintsData.report);
        setMaintenance(maintenanceData.report);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load reports.");
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
        description="Hostel-scoped operational reports and pilot metrics."
        icon={BarChart3}
        title="Reports"
      />
      <Message value={message} />
      <Panel title="Dashboard">
        <ReportGrid report={dashboard} />
      </Panel>
      <div className="grid gap-5 xl:grid-cols-3">
        <Panel title="Payments">
          <ReportGrid report={payments} />
        </Panel>
        <Panel title="Complaints">
          <ReportGrid report={complaints} />
        </Panel>
        <Panel title="Maintenance">
          <ReportGrid report={maintenance} />
        </Panel>
      </div>
    </div>
  );
}
