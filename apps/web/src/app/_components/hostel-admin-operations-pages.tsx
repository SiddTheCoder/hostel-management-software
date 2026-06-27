"use client";

import {
  Bell,
  Check,
  ChefHat,
  CreditCard,
  MessageSquareWarning,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { browserApi } from "@/lib/browser-api";
import { cn } from "@/lib/utils";

type LoadState = "idle" | "loading" | "ready" | "error";

type Resident = {
  bedId: string;
  demoDataLabel?: string;
  depositAmount: number;
  email?: string;
  firstName: string;
  fullName?: string;
  id: string;
  isDemoData?: boolean;
  lastName: string;
  moveInDate: string;
  phone: string;
  roomId: string;
  status: "PENDING" | "ACTIVE" | "SUSPENDED" | "MOVED_OUT";
};

type RoomMapBed = {
  bedNumber: string;
  id: string;
  status: string;
};

type RoomMapRoom = {
  beds: RoomMapBed[];
  id: string;
  roomNumber: string;
  roomType: string;
};

type RoomMapFloor = {
  id: string;
  name: string;
  rooms: RoomMapRoom[];
};

type Payment = {
  dueAmount: number;
  dueDate: string;
  id: string;
  month: string;
  paidAmount: number;
  paymentMethod?: string;
  residentId: string;
  status: "UNPAID" | "PAID" | "PARTIAL" | "OVERDUE" | "PENDING_PROOF";
};

type PaymentProof = {
  id: string;
  paymentId: string;
  proofImageAssetId: string;
  rejectionReason?: string;
  residentId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
  transactionCode?: string;
};

type FoodMenu = {
  date: string;
  dayOfWeek: string;
  id: string;
  items: string[];
  mealType: "BREAKFAST" | "LUNCH" | "SNACKS" | "DINNER";
  specialNotes?: string;
  timing: string;
  weekStartDate: string;
};

type Notice = {
  category: string;
  content: string;
  expiresAt?: string;
  id: string;
  isUrgent: boolean;
  publishedAt?: string;
  title: string;
};

type Complaint = {
  adminResponse?: string;
  attachments: Array<{
    fileAssetId: string;
    id: string;
  }>;
  category: string;
  confirmedAt?: string;
  createdAt?: string;
  description: string;
  id: string;
  isAnonymous: boolean;
  isOverdue: boolean;
  residentId: string | null;
  slaDueAt: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  title: string;
};

type ComplaintSummary = {
  inProgress: number;
  overdue: number;
  pending: number;
  rejected: number;
  resolved: number;
  total: number;
};

function field(form: FormData, name: string) {
  const value = form.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function optionalField(form: FormData, name: string) {
  const value = field(form, name);

  return value.length > 0 ? value : undefined;
}

function currency(value: number) {
  return new Intl.NumberFormat("en-NP", {
    currency: "NPR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function StatusBadge({ children }: { children: string }) {
  const tone =
    children.includes("PAID") ||
    children.includes("ACTIVE") ||
    children.includes("APPROVED")
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : children.includes("PENDING")
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : children.includes("REJECTED") || children.includes("OVERDUE")
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-border bg-muted text-muted-foreground";

  return (
    <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", tone)}>
      {children.replaceAll("_", " ")}
    </span>
  );
}

function DemoDataBadge({ label }: { label?: string }) {
  return (
    <span
      className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-700"
      title={label || "Seeded demo/test data"}
    >
      Mock/Test data
    </span>
  );
}

function PageHeader({
  action,
  description,
  icon: Icon,
  title,
}: {
  action?: ReactNode;
  description: string;
  icon: typeof Users;
  title: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <span className="rounded-lg bg-role-admin-soft p-3 text-role-admin">
          <Icon className="size-5" />
        </span>
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">{title}</h1>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function Panel({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface p-5 shadow-sm",
        className,
      )}
    >
      {title ? (
        <h2 className="mb-4 font-heading text-lg font-semibold text-primary">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}

function Input({
  defaultValue,
  label,
  name,
  required,
  type = "text",
}: {
  defaultValue?: string | number;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-primary">
      {label}
      <input
        className="h-11 rounded-md border border-border bg-background px-3 text-sm font-normal outline-none focus:border-role-admin"
        defaultValue={defaultValue}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function Select({
  children,
  defaultValue,
  label,
  name,
  required,
}: {
  children: ReactNode;
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-primary">
      {label}
      <select
        className="h-11 rounded-md border border-border bg-background px-3 text-sm font-normal outline-none focus:border-role-admin"
        defaultValue={defaultValue}
        name={name}
        required={required}
      >
        {children}
      </select>
    </label>
  );
}

function TextArea({
  defaultValue,
  label,
  name,
}: {
  defaultValue?: string;
  label: string;
  name: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-primary">
      {label}
      <textarea
        className="min-h-24 rounded-md border border-border bg-background px-3 py-2 text-sm font-normal outline-none focus:border-role-admin"
        defaultValue={defaultValue}
        name={name}
      />
    </label>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="h-12 animate-pulse rounded-md bg-muted" key={index} />
      ))}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function HostelAdminResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [floors, setFloors] = useState<RoomMapFloor[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const selectedResident = residents.find(
    (resident) => resident.id === selectedResidentId,
  );
  const roomOptions = useMemo(
    () =>
      floors.flatMap((floor) =>
        floor.rooms.map((room) => ({ ...room, floorName: floor.name })),
      ),
    [floors],
  );
  const bedOptions = useMemo(
    () =>
      roomOptions.flatMap((room) =>
        room.beds.map((bed) => ({
          ...bed,
          label: `${room.floorName} / Room ${room.roomNumber} / Bed ${bed.bedNumber}`,
          roomId: room.id,
        })),
      ),
    [roomOptions],
  );

  const load = useCallback(async () => {
    setState("loading");
    try {
      const [residentData, roomMapData] = await Promise.all([
        browserApi<{ residents: Resident[] }>("/api/v1/hostel-admin/residents"),
        browserApi<{ floors: RoomMapFloor[] }>("/api/v1/hostel-admin/room-map"),
      ]);

      setResidents(residentData.residents);
      setFloors(roomMapData.floors);
      setSelectedResidentId((current) => current || residentData.residents[0]?.id || "");
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load residents.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function handleCreateResident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const bedId = field(form, "bedId");
    const bed = bedOptions.find((option) => option.id === bedId);

    try {
      await browserApi("/api/v1/hostel-admin/residents", {
        body: JSON.stringify({
          bedId,
          depositAmount: Number(field(form, "depositAmount") || 0),
          email: optionalField(form, "email"),
          firstName: field(form, "firstName"),
          lastName: field(form, "lastName"),
          moveInDate: field(form, "moveInDate"),
          phone: field(form, "phone"),
          roomId: bed?.roomId,
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setMessage("Resident created.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create resident.");
    }
  }

  async function handleGenerateActivation() {
    if (!selectedResidentId) {
      return;
    }

    try {
      const result = await browserApi<{
        activation: {
          code?: string;
        };
      }>(`/api/v1/hostel-admin/residents/${selectedResidentId}/activation-code`, {
        body: JSON.stringify({ expiresInHours: 48 }),
        method: "POST",
      });

      setActivationCode(result.activation.code ?? "");
      setMessage("Activation code generated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not generate activation code.",
      );
    }
  }

  async function handleAddGuardian(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedResidentId) {
      return;
    }

    const form = new FormData(event.currentTarget);

    try {
      await browserApi(`/api/v1/hostel-admin/residents/${selectedResidentId}/guardians`, {
        body: JSON.stringify({
          email: optionalField(form, "email"),
          firstName: field(form, "firstName"),
          isPrimary: form.get("isPrimary") === "on",
          lastName: field(form, "lastName"),
          phone: field(form, "phone"),
          relation: field(form, "relation"),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setMessage("Guardian saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save guardian.");
    }
  }

  async function handleAddEmergencyContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedResidentId) {
      return;
    }

    const form = new FormData(event.currentTarget);

    try {
      await browserApi(
        `/api/v1/hostel-admin/residents/${selectedResidentId}/emergency-contacts`,
        {
          body: JSON.stringify({
            isPrimary: form.get("isPrimary") === "on",
            name: field(form, "name"),
            phone: field(form, "phone"),
            relation: field(form, "relation"),
          }),
          method: "POST",
        },
      );
      event.currentTarget.reset();
      setMessage("Emergency contact saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save emergency contact.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        action={
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-role-admin px-4 py-2.5 text-sm font-semibold text-white"
            onClick={handleGenerateActivation}
            type="button"
          >
            <QrCode className="size-4" />
            Generate Code
          </button>
        }
        description="Register residents, assign vacant beds, and manage activation contacts."
        icon={Users}
        title="Residents"
      />

      {message ? (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          {message}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <Panel title="Resident List">
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? (
            <EmptyState label="Residents could not be loaded." />
          ) : null}
          {state === "ready" && residents.length === 0 ? (
            <EmptyState label="No residents yet." />
          ) : null}
          {state === "ready" && residents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2">Resident</th>
                    <th>Phone</th>
                    <th>Deposit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {residents.map((resident) => (
                    <tr
                      className={cn(
                        "cursor-pointer hover:bg-muted/40",
                        selectedResidentId === resident.id && "bg-role-admin-soft/40",
                      )}
                      key={resident.id}
                      onClick={() => setSelectedResidentId(resident.id)}
                    >
                      <td className="py-3 font-semibold text-primary">
                        <div className="flex flex-wrap items-center gap-2">
                          <span>
                            {resident.firstName} {resident.lastName}
                          </span>
                          {resident.isDemoData ? (
                            <DemoDataBadge label={resident.demoDataLabel} />
                          ) : null}
                        </div>
                        <p className="text-xs font-normal text-muted-foreground">
                          Room {resident.roomId.slice(-4)} / Bed{" "}
                          {resident.bedId.slice(-4)}
                        </p>
                      </td>
                      <td>{resident.phone}</td>
                      <td>{currency(resident.depositAmount)}</td>
                      <td>
                        <StatusBadge>{resident.status}</StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </Panel>

        <div className="space-y-5">
          <Panel title="Add Resident">
            <form className="grid gap-3" onSubmit={handleCreateResident}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="First name" name="firstName" required />
                <Input label="Last name" name="lastName" required />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Phone" name="phone" required />
                <Input label="Email" name="email" type="email" />
              </div>
              <Select label="Available bed" name="bedId" required>
                <option value="">Select bed</option>
                {bedOptions
                  .filter((bed) => bed.status === "AVAILABLE")
                  .map((bed) => (
                    <option key={bed.id} value={bed.id}>
                      {bed.label}
                    </option>
                  ))}
              </Select>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Move-in date" name="moveInDate" required type="date" />
                <Input label="Deposit" name="depositAmount" required type="number" />
              </div>
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-role-admin text-sm font-semibold text-white">
                <UserPlus className="size-4" />
                Add Resident
              </button>
            </form>
          </Panel>

          <Panel title="Selected Resident">
            {selectedResident ? (
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-bold text-primary">
                    {selectedResident.firstName} {selectedResident.lastName}
                  </p>
                  {selectedResident.isDemoData ? (
                    <div className="mt-2">
                      <DemoDataBadge label={selectedResident.demoDataLabel} />
                    </div>
                  ) : null}
                  <p className="text-sm text-muted-foreground">
                    {selectedResident.phone}
                  </p>
                </div>
                {activationCode ? (
                  <div className="rounded-lg border border-role-admin/30 bg-role-admin-soft/50 p-4">
                    <p className="text-sm font-semibold text-primary">Activation Code</p>
                    <p className="mt-2 font-mono text-2xl font-bold tracking-widest text-role-admin">
                      {activationCode}
                    </p>
                  </div>
                ) : null}
                <form className="grid gap-3" onSubmit={handleAddGuardian}>
                  <h3 className="text-sm font-bold text-primary">Guardian</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input label="First name" name="firstName" required />
                    <Input label="Last name" name="lastName" required />
                  </div>
                  <Input label="Phone" name="phone" required />
                  <Input label="Relation" name="relation" required />
                  <Input label="Email" name="email" type="email" />
                  <label className="flex items-center gap-2 text-sm text-primary">
                    <input name="isPrimary" type="checkbox" />
                    Primary guardian
                  </label>
                  <button className="h-10 rounded-md border border-role-admin px-3 text-sm font-semibold text-role-admin">
                    Save Guardian
                  </button>
                </form>
                <form className="grid gap-3" onSubmit={handleAddEmergencyContact}>
                  <h3 className="text-sm font-bold text-primary">Emergency Contact</h3>
                  <Input label="Name" name="name" required />
                  <Input label="Phone" name="phone" required />
                  <Input label="Relation" name="relation" required />
                  <label className="flex items-center gap-2 text-sm text-primary">
                    <input name="isPrimary" type="checkbox" />
                    Primary contact
                  </label>
                  <button className="h-10 rounded-md border border-role-admin px-3 text-sm font-semibold text-role-admin">
                    Save Contact
                  </button>
                </form>
              </div>
            ) : (
              <EmptyState label="Select a resident." />
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function HostelAdminPaymentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [filter, setFilter] = useState("");
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const residentById = useMemo(
    () => new Map(residents.map((resident) => [resident.id, resident])),
    [residents],
  );

  const load = useCallback(async () => {
    setState("loading");
    try {
      const [residentData, paymentData] = await Promise.all([
        browserApi<{ residents: Resident[] }>("/api/v1/hostel-admin/residents"),
        browserApi<{ payments: Payment[]; proofs: PaymentProof[] }>(
          `/api/v1/hostel-admin/payments${filter ? `?status=${filter}` : ""}`,
        ),
      ]);

      setResidents(residentData.residents);
      setPayments(paymentData.payments);
      setProofs(paymentData.proofs);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load payments.");
      setState("error");
    }
  }, [filter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function handleCreatePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/hostel-admin/payments", {
        body: JSON.stringify({
          dueAmount: Number(field(form, "dueAmount")),
          dueDate: field(form, "dueDate"),
          month: field(form, "month"),
          residentId: field(form, "residentId"),
          remarks: optionalField(form, "remarks"),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setMessage("Payment record created.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create payment.");
    }
  }

  async function reviewProof(proofId: string, action: "approve" | "reject") {
    const rejectionReason =
      action === "reject" ? window.prompt("Rejection reason")?.trim() : undefined;

    if (action === "reject" && !rejectionReason) {
      return;
    }

    try {
      await browserApi(`/api/v1/hostel-admin/payment-proofs/${proofId}/${action}`, {
        body: JSON.stringify(action === "reject" ? { rejectionReason } : {}),
        method: "PATCH",
      });
      setMessage(action === "approve" ? "Proof approved." : "Proof rejected.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not review proof.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        action={
          <select
            className="h-11 rounded-md border border-border bg-background px-3 text-sm"
            onChange={(event) => setFilter(event.target.value)}
            value={filter}
          >
            <option value="">All statuses</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PENDING_PROOF">Pending proof</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        }
        description="Create monthly fee records and review resident payment proofs."
        icon={CreditCard}
        title="Payments"
      />
      {message ? (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          {message}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Panel title="Payment Records">
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? (
            <EmptyState label="Payments could not be loaded." />
          ) : null}
          {state === "ready" && payments.length === 0 ? (
            <EmptyState label="No payment records." />
          ) : null}
          {state === "ready" && payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2">Resident</th>
                    <th>Month</th>
                    <th>Due</th>
                    <th>Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((payment) => {
                    const resident = residentById.get(payment.residentId);

                    return (
                      <tr key={payment.id}>
                        <td className="py-3 font-semibold text-primary">
                          {resident
                            ? `${resident.firstName} ${resident.lastName}`
                            : payment.residentId}
                        </td>
                        <td>{payment.month}</td>
                        <td>{currency(payment.dueAmount)}</td>
                        <td>{currency(payment.paidAmount)}</td>
                        <td>
                          <StatusBadge>{payment.status}</StatusBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </Panel>

        <Panel title="Create Payment">
          <form className="grid gap-3" onSubmit={handleCreatePayment}>
            <Select label="Resident" name="residentId" required>
              <option value="">Select resident</option>
              {residents.map((resident) => (
                <option key={resident.id} value={resident.id}>
                  {resident.firstName} {resident.lastName}
                </option>
              ))}
            </Select>
            <Input label="Month" name="month" required type="month" />
            <Input label="Due amount" name="dueAmount" required type="number" />
            <Input label="Due date" name="dueDate" required type="date" />
            <TextArea label="Remarks" name="remarks" />
            <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
              Create Record
            </button>
          </form>
        </Panel>
      </div>

      <Panel title="Payment Proof Review">
        {proofs.length === 0 ? <EmptyState label="No proofs submitted." /> : null}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {proofs.map((proof) => (
            <div className="rounded-lg border border-border p-4" key={proof.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">
                    {residentById.get(proof.residentId)?.firstName ?? "Resident"} proof
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {proof.proofImageAssetId}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {proof.transactionCode}
                  </p>
                </div>
                <StatusBadge>{proof.status}</StatusBadge>
              </div>
              {proof.status === "PENDING" ? (
                <div className="mt-4 flex gap-2">
                  <button
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                    onClick={() => void reviewProof(proof.id, "approve")}
                    type="button"
                  >
                    <Check className="size-4" />
                    Approve
                  </button>
                  <button
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
                    onClick={() => void reviewProof(proof.id, "reject")}
                    type="button"
                  >
                    <X className="size-4" />
                    Reject
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

export function HostelAdminFoodPage() {
  const [menus, setMenus] = useState<FoodMenu[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ menus: FoodMenu[] }>(
        "/api/v1/hostel-admin/food/menu",
      );

      setMenus(data.menus);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load food menus.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function handleCreateMenu(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/hostel-admin/food/menu", {
        body: JSON.stringify({
          date: field(form, "date"),
          dayOfWeek: field(form, "dayOfWeek"),
          items: field(form, "items")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          mealType: field(form, "mealType"),
          specialNotes: optionalField(form, "specialNotes"),
          timing: field(form, "timing"),
          weekStartDate: field(form, "weekStartDate"),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setMessage("Menu published.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not publish menu.");
    }
  }

  async function handlePhotoUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/hostel-admin/food/photos", {
        body: JSON.stringify({
          caption: optionalField(form, "caption"),
          date: field(form, "date"),
          mealType: field(form, "mealType"),
          photoAssetId: field(form, "photoAssetId"),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setMessage("Food photo uploaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not upload photo.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Publish weekly meal plans and daily food photos."
        icon={ChefHat}
        title="Food"
      />
      {message ? (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          {message}
        </div>
      ) : null}
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="Menus">
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? <EmptyState label="Menus could not be loaded." /> : null}
          {state === "ready" && menus.length === 0 ? (
            <EmptyState label="No menu items." />
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            {menus.map((menu) => (
              <div className="rounded-lg border border-border p-4" key={menu.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">
                      {menu.mealType.replace("_", " ")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(menu.date).toLocaleDateString()} / {menu.timing}
                    </p>
                  </div>
                  <StatusBadge>{menu.dayOfWeek}</StatusBadge>
                </div>
                <p className="mt-3 text-sm text-primary">{menu.items.join(", ")}</p>
                {menu.specialNotes ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {menu.specialNotes}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Create Menu">
            <form className="grid gap-3" onSubmit={handleCreateMenu}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Date" name="date" required type="date" />
                <Input label="Week start" name="weekStartDate" required type="date" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Select label="Day" name="dayOfWeek" required>
                  {[
                    "SUNDAY",
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THURSDAY",
                    "FRIDAY",
                    "SATURDAY",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </Select>
                <Select label="Meal" name="mealType" required>
                  {["BREAKFAST", "LUNCH", "SNACKS", "DINNER"].map((meal) => (
                    <option key={meal} value={meal}>
                      {meal}
                    </option>
                  ))}
                </Select>
              </div>
              <Input label="Items" name="items" required />
              <Input label="Timing" name="timing" required />
              <TextArea label="Special notes" name="specialNotes" />
              <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
                Publish Menu
              </button>
            </form>
          </Panel>
          <Panel title="Upload Photo">
            <form className="grid gap-3" onSubmit={handlePhotoUpload}>
              <Input label="Photo asset id" name="photoAssetId" required />
              <Input label="Date" name="date" required type="date" />
              <Select label="Meal" name="mealType" required>
                {["BREAKFAST", "LUNCH", "SNACKS", "DINNER"].map((meal) => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </Select>
              <Input label="Caption" name="caption" />
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-role-admin text-sm font-semibold text-role-admin">
                <Upload className="size-4" />
                Upload
              </button>
            </form>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function HostelAdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ notices: Notice[] }>(
        "/api/v1/hostel-admin/notices",
      );

      setNotices(data.notices);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load notices.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  async function handleCreateNotice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/hostel-admin/notices", {
        body: JSON.stringify({
          category: field(form, "category"),
          content: field(form, "content"),
          expiresAt: optionalField(form, "expiresAt"),
          isUrgent: form.get("isUrgent") === "on",
          title: field(form, "title"),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setMessage("Notice published.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not publish notice.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Publish notices and keep resident read status available."
        icon={Bell}
        title="Notices"
      />
      {message ? (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          {message}
        </div>
      ) : null}
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="Published Notices">
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? <EmptyState label="Notices could not be loaded." /> : null}
          {state === "ready" && notices.length === 0 ? (
            <EmptyState label="No notices published." />
          ) : null}
          <div className="space-y-3">
            {notices.map((notice) => (
              <div className="rounded-lg border border-border p-4" key={notice.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{notice.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{notice.content}</p>
                  </div>
                  <div className="flex gap-2">
                    {notice.isUrgent ? <StatusBadge>URGENT</StatusBadge> : null}
                    <StatusBadge>{notice.category}</StatusBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Create Notice">
          <form className="grid gap-3" onSubmit={handleCreateNotice}>
            <Input label="Title" name="title" required />
            <Select label="Category" name="category" required>
              {[
                "GENERAL",
                "URGENT",
                "EVENT",
                "RULE",
                "MAINTENANCE",
                "PAYMENT",
                "FOOD",
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <TextArea label="Content" name="content" />
            <Input label="Expires at" name="expiresAt" type="date" />
            <label className="flex items-center gap-2 text-sm text-primary">
              <input name="isUrgent" type="checkbox" />
              Urgent
            </label>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-role-admin text-sm font-semibold text-white">
              <ShieldCheck className="size-4" />
              Publish Notice
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
}

export function HostelAdminComplaintsPage() {
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

  async function handleReply(event: FormEvent<HTMLFormElement>, complaintId: string) {
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
  }

  async function handleStatus(event: FormEvent<HTMLFormElement>, complaintId: string) {
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
  }

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
        {[
          ["Total", summary.total],
          ["Pending", summary.pending],
          ["In Progress", summary.inProgress],
          ["Overdue", summary.overdue],
          ["Resolved", summary.resolved],
        ].map(([label, value]) => (
          <Panel key={label as string}>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
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
                  <p className="font-semibold text-primary">{complaint.title}</p>
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
                <div className="mt-4 rounded-md bg-muted p-3 text-sm text-primary">
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
}

export function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-primary"
      onClick={onClick}
      type="button"
    >
      <RefreshCw className="size-4" />
      Refresh
    </button>
  );
}

export { EmptyState, Input, LoadingRows, Panel, Select, StatusBadge, TextArea, currency };
