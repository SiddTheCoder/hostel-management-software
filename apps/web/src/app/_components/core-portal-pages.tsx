"use client";

import { BedDouble, Building2, Home, Inbox, LayoutDashboard, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useParams } from "next/navigation";

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
type ReportRecord = Record<string, unknown>;

type Hostel = {
  capacitySummary?: {
    totalBeds?: number;
    totalRooms?: number;
    vacantBeds?: number;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
  demoDataLabel?: string;
  description?: string;
  facilities: string[];
  food?: {
    hasNonVeg?: boolean;
    hasVeg?: boolean;
    mealsPerDay?: number;
    notes?: string;
  };
  hostelType: "BOYS" | "GIRLS" | "CO_LIVING";
  id: string;
  isDemoData?: boolean;
  location: {
    address?: string;
    area: string;
    city?: string;
  };
  name: string;
  ownerId: string;
  photos: Array<{ id?: string; url?: string }>;
  pricing?: {
    monthlyRentMax?: number;
    monthlyRentMin?: number;
  };
  roomTypes: string[];
  rules: string[];
  slug: string;
  status: string;
  verificationStatus: string;
};

type UserRecord = {
  createdAt?: string;
  demoDataLabel?: string;
  email?: string;
  hostelIds: string[];
  id: string;
  isDemoData?: boolean;
  lastLoginAt?: string;
  name: string;
  phone?: string;
  role: string;
  status: string;
};

type Inquiry = {
  budgetRange?: string;
  createdAt?: string;
  email?: string;
  gender?: string;
  id: string;
  message?: string;
  name: string;
  phone: string;
  preferredRoomType?: string;
  preferredVisitDate?: string;
  status: string;
};

type RoomMapBed = {
  bedNumber: string;
  id: string;
  status: string;
};

type RoomMapRoom = {
  beds: RoomMapBed[];
  capacity: number;
  facilities: string[];
  id: string;
  repairStatus: string;
  roomNumber: string;
  roomType: string;
  vacancyStatus: string;
};

type RoomMapFloor = {
  id: string;
  level: number;
  name: string;
  rooms: RoomMapRoom[];
};

function field(form: FormData, name: string) {
  const value = form.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function optionalField(form: FormData, name: string) {
  const value = field(form, name);

  return value.length > 0 ? value : undefined;
}

function csvField(form: FormData, name: string) {
  return field(form, name)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberField(form: FormData, name: string) {
  const value = Number(field(form, name));

  return Number.isFinite(value) ? value : 0;
}

function deferLoad(load: () => Promise<void>) {
  let cancelled = false;

  queueMicrotask(() => {
    if (!cancelled) {
      void load();
    }
  });

  return () => {
    cancelled = true;
  };
}

function Message({ value }: { value: string }) {
  return value ? (
    <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">{value}</div>
  ) : null;
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
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: typeof LayoutDashboard;
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Object.entries(report).map(([key, value]) => (
        <Panel key={key}>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            {key.replace(/([A-Z])/g, " $1")}
          </p>
          <p className="mt-2 text-2xl font-bold text-primary">
            {typeof value === "number"
              ? key.toLowerCase().includes("amount") || key.toLowerCase().includes("due")
                ? currency(value)
                : value.toLocaleString()
              : typeof value === "string"
                ? value
                : JSON.stringify(value)}
          </p>
        </Panel>
      ))}
    </div>
  );
}

function HostelTable({
  hostels,
  onAction,
}: {
  hostels: Hostel[];
  onAction?: (hostelId: string, action: string) => void;
}) {
  if (hostels.length === 0) {
    return <EmptyState label="No hostels found." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-muted-foreground">
          <tr>
            <th className="py-2">Hostel</th>
            <th>Location</th>
            <th>Rent</th>
            <th>Status</th>
            <th>Verification</th>
            {onAction ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {hostels.map((hostel) => (
            <tr key={hostel.id}>
              <td className="py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-primary">{hostel.name}</p>
                  {hostel.isDemoData ? (
                    <DemoDataBadge label={hostel.demoDataLabel} />
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">{hostel.slug}</p>
              </td>
              <td>
                {hostel.location.area}, {hostel.location.city ?? "Kathmandu"}
              </td>
              <td>
                {hostel.pricing?.monthlyRentMin
                  ? currency(hostel.pricing.monthlyRentMin)
                  : "-"}
              </td>
              <td>
                <StatusBadge>{hostel.status}</StatusBadge>
              </td>
              <td>
                <StatusBadge>{hostel.verificationStatus}</StatusBadge>
              </td>
              {onAction ? (
                <td>
                  <div className="flex flex-wrap gap-2">
                    {["approve", "reject", "publish", "unpublish"].map((action) => (
                      <button
                        className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-primary"
                        key={action}
                        onClick={() => onAction(hostel.id, action)}
                        type="button"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PlatformDashboardPageContent() {
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");

  useEffect(() => {
    async function load() {
      setState("loading");
      try {
        const [reportData, hostelData] = await Promise.all([
          browserApi<{ report: ReportRecord }>("/api/v1/platform/reports/dashboard"),
          browserApi<{ hostels: Hostel[] }>("/api/v1/platform/hostels"),
        ]);

        setReport(reportData.report);
        setHostels(hostelData.hostels.slice(0, 8));
        setState("ready");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
        setState("error");
      }
    }

    return deferLoad(load);
  }, []);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Platform-wide live metrics, approvals, and moderation status."
        icon={LayoutDashboard}
        title="Platform Dashboard"
      />
      <Message value={message} />
      {state === "loading" ? <LoadingRows /> : null}
      <ReportGrid report={report} />
      <Panel title="Recent Hostels">
        <HostelTable hostels={hostels} />
      </Panel>
    </div>
  );
}

export function PlatformHostelsPageContent() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ hostels: Hostel[] }>("/api/v1/platform/hostels");

      setHostels(data.hostels);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load hostels.");
      setState("error");
    }
  }, []);

  useEffect(() => deferLoad(load), [load]);

  async function action(hostelId: string, nextAction: string) {
    const body =
      nextAction === "reject"
        ? JSON.stringify({
            reason: window.prompt("Rejection reason") || "Rejected by platform owner.",
          })
        : JSON.stringify({});

    try {
      await browserApi(`/api/v1/platform/hostels/${hostelId}/${nextAction}`, {
        body,
        method: "PATCH",
      });
      setMessage(`Hostel ${nextAction} action completed.`);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Action failed.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Review, approve, reject, publish, and unpublish hostel listings."
        icon={Building2}
        title="Hostel Approvals"
      />
      <Message value={message} />
      <Panel>
        {state === "loading" ? <LoadingRows /> : null}
        {state === "error" ? <EmptyState label="Hostels could not be loaded." /> : null}
        {state === "ready" ? <HostelTable hostels={hostels} onAction={action} /> : null}
      </Panel>
    </div>
  );
}

export function PlatformHostelReviewPageContent() {
  const params = useParams<{ id: string }>();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ hostel: Hostel }>(
        `/api/v1/platform/hostels/${params.id}`,
      );

      setHostel(data.hostel);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load hostel.");
    }
  }, [params.id]);

  useEffect(() => deferLoad(load), [load]);

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <PageHeader
        description="Detailed platform review record for this hostel."
        icon={Building2}
        title="Hostel Verification"
      />
      <Message value={message} />
      {hostel ? (
        <Panel title={hostel.name}>
          <div className="grid gap-4 md:grid-cols-2">
            <p>Location: {hostel.location.address || hostel.location.area}</p>
            <p>Type: {hostel.hostelType}</p>
            <p>Status: {hostel.status}</p>
            <p>Verification: {hostel.verificationStatus}</p>
            <p>Phone: {hostel.contact?.phone || "-"}</p>
            <p>Email: {hostel.contact?.email || "-"}</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{hostel.description}</p>
        </Panel>
      ) : (
        <EmptyState label="Hostel detail is not loaded." />
      )}
    </div>
  );
}

export function PlatformUsersPageContent() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await browserApi<{ users: UserRecord[] }>("/api/v1/platform/users");

        setUsers(data.users);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load users.");
      }
    }

    return deferLoad(load);
  }, []);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Platform-visible users and role assignments."
        icon={Users}
        title="Users"
      />
      <Message value={message} />
      <Panel>
        {users.length === 0 ? <EmptyState label="No users found." /> : null}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr>
                <th className="py-2">User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Hostels</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-primary">{user.name}</span>
                      {user.isDemoData ? (
                        <DemoDataBadge label={user.demoDataLabel} />
                      ) : null}
                    </div>
                  </td>
                  <td>
                    {user.email || "-"}
                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <StatusBadge>{user.status}</StatusBadge>
                  </td>
                  <td>{user.hostelIds.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

export function HostelAdminDashboardPageContent() {
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await browserApi<{ report: ReportRecord }>(
          "/api/v1/hostel-admin/reports/dashboard",
        );

        setReport(data.report);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
      }
    }

    return deferLoad(load);
  }, []);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Live hostel-scoped operations metrics from the database."
        icon={LayoutDashboard}
        title="Hostel Dashboard"
      />
      <Message value={message} />
      <ReportGrid report={report} />
    </div>
  );
}

export function HostelAdminProfilePageContent() {
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ hostel: Hostel }>("/api/v1/hostel-admin/profile");

      setHostel(data.hostel);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load profile.");
    }
  }, []);

  useEffect(() => deferLoad(load), [load]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/hostel-admin/profile", {
        body: JSON.stringify({
          contact: {
            email: optionalField(form, "email"),
            phone: optionalField(form, "phone"),
          },
          description: optionalField(form, "description"),
          facilities: csvField(form, "facilities"),
          food: {
            hasNonVeg: form.get("hasNonVeg") === "on",
            hasVeg: form.get("hasVeg") === "on",
            mealsPerDay: numberField(form, "mealsPerDay"),
            notes: optionalField(form, "foodNotes"),
          },
          hostelType: field(form, "hostelType"),
          location: {
            address: optionalField(form, "address"),
            area: field(form, "area"),
            city: field(form, "city"),
          },
          name: field(form, "name"),
          pricing: {
            monthlyRentMax: numberField(form, "monthlyRentMax"),
            monthlyRentMin: numberField(form, "monthlyRentMin"),
          },
          roomTypes: csvField(form, "roomTypes"),
          rules: csvField(form, "rules"),
        }),
        method: "PATCH",
      });
      setMessage("Profile saved.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save profile.");
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <PageHeader
        description="Real hostel listing fields stored in MongoDB and shown publicly after approval."
        icon={Home}
        title="Hostel Profile"
      />
      <Message value={message} />
      {hostel ? (
        <Panel title="Profile Details">
          {hostel.isDemoData ? (
            <div className="mb-4">
              <DemoDataBadge label={hostel.demoDataLabel} />
            </div>
          ) : null}
          <form className="grid gap-4" key={hostel.id} onSubmit={save}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input defaultValue={hostel.name} label="Name" name="name" required />
              <Select
                defaultValue={hostel.hostelType}
                label="Type"
                name="hostelType"
                required
              >
                {["BOYS", "GIRLS", "CO_LIVING"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              <Input
                defaultValue={hostel.location.area}
                label="Area"
                name="area"
                required
              />
              <Input
                defaultValue={hostel.location.city}
                label="City"
                name="city"
                required
              />
              <Input
                defaultValue={hostel.location.address}
                label="Address"
                name="address"
              />
              <Input defaultValue={hostel.contact?.phone} label="Phone" name="phone" />
              <Input
                defaultValue={hostel.contact?.email}
                label="Email"
                name="email"
                type="email"
              />
              <Input
                defaultValue={hostel.roomTypes.join(", ")}
                label="Room types (comma separated)"
                name="roomTypes"
              />
              <Input
                defaultValue={hostel.facilities.join(", ")}
                label="Facilities (comma separated)"
                name="facilities"
              />
              <Input
                defaultValue={hostel.rules.join(", ")}
                label="Rules (comma separated)"
                name="rules"
              />
              <Input
                defaultValue={hostel.pricing?.monthlyRentMin}
                label="Monthly rent min"
                name="monthlyRentMin"
                type="number"
              />
              <Input
                defaultValue={hostel.pricing?.monthlyRentMax}
                label="Monthly rent max"
                name="monthlyRentMax"
                type="number"
              />
              <Input
                defaultValue={hostel.food?.mealsPerDay}
                label="Meals per day"
                name="mealsPerDay"
                type="number"
              />
            </div>
            <TextArea
              defaultValue={hostel.description}
              label="Description"
              name="description"
            />
            <TextArea
              defaultValue={hostel.food?.notes}
              label="Food notes"
              name="foodNotes"
            />
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  defaultChecked={hostel.food?.hasVeg ?? true}
                  name="hasVeg"
                  type="checkbox"
                />
                Veg
              </label>
              <label className="flex items-center gap-2">
                <input
                  defaultChecked={hostel.food?.hasNonVeg ?? true}
                  name="hasNonVeg"
                  type="checkbox"
                />
                Non-veg
              </label>
            </div>
            <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
              Save Profile
            </button>
          </form>
        </Panel>
      ) : (
        <EmptyState label="Profile is not loaded." />
      )}
    </div>
  );
}

export function HostelAdminRoomsPageContent() {
  const [floors, setFloors] = useState<RoomMapFloor[]>([]);
  const [message, setMessage] = useState("");

  const rooms = useMemo(() => floors.flatMap((floor) => floor.rooms), [floors]);

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ floors: RoomMapFloor[] }>(
        "/api/v1/hostel-admin/room-map",
      );

      setFloors(data.floors);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load rooms.");
    }
  }, []);

  useEffect(() => deferLoad(load), [load]);

  async function createFloor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/hostel-admin/floors", {
        body: JSON.stringify({
          level: numberField(form, "level"),
          name: field(form, "name"),
          sortOrder: numberField(form, "sortOrder"),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create floor.");
    }
  }

  async function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/hostel-admin/rooms", {
        body: JSON.stringify({
          capacity: numberField(form, "capacity"),
          facilities: csvField(form, "facilities"),
          floorId: field(form, "floorId"),
          repairStatus: field(form, "repairStatus"),
          roomNumber: field(form, "roomNumber"),
          roomType: field(form, "roomType"),
          vacancyStatus: "VACANT",
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create room.");
    }
  }

  async function createBed(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/hostel-admin/beds", {
        body: JSON.stringify({
          bedNumber: field(form, "bedNumber"),
          repairStatus: field(form, "repairStatus"),
          roomId: field(form, "roomId"),
          status: field(form, "status"),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create bed.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Floor, room, and bed data stored as hostel-scoped MongoDB records."
        icon={BedDouble}
        title="Rooms & Beds"
      />
      <Message value={message} />
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="Room Map">
          {floors.length === 0 ? <EmptyState label="No floors or rooms yet." /> : null}
          <div className="space-y-4">
            {floors.map((floor) => (
              <div className="rounded-lg border border-border p-4" key={floor.id}>
                <h3 className="font-semibold text-primary">{floor.name}</h3>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {floor.rooms.map((room) => (
                    <div className="rounded-md border border-border p-3" key={room.id}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-primary">
                            Room {room.roomNumber}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {room.roomType} / capacity {room.capacity}
                          </p>
                        </div>
                        <StatusBadge>{room.vacancyStatus}</StatusBadge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Beds:{" "}
                        {room.beds
                          .map((bed) => `${bed.bedNumber} ${bed.status}`)
                          .join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Create Floor">
            <form className="grid gap-3" onSubmit={createFloor}>
              <Input label="Name" name="name" required />
              <Input label="Level" name="level" required type="number" />
              <Input label="Sort order" name="sortOrder" type="number" />
              <button className="h-10 rounded-md bg-role-admin text-sm font-semibold text-white">
                Add Floor
              </button>
            </form>
          </Panel>
          <Panel title="Create Room">
            <form className="grid gap-3" onSubmit={createRoom}>
              <Select label="Floor" name="floorId" required>
                <option value="">Select floor</option>
                {floors.map((floor) => (
                  <option key={floor.id} value={floor.id}>
                    {floor.name}
                  </option>
                ))}
              </Select>
              <Input label="Room number" name="roomNumber" required />
              <Input label="Room type" name="roomType" required />
              <Input label="Capacity" name="capacity" required type="number" />
              <Input label="Facilities" name="facilities" />
              <Select label="Repair status" name="repairStatus">
                {["OK", "NEEDS_REPAIR", "UNDER_REPAIR"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              <button className="h-10 rounded-md bg-role-admin text-sm font-semibold text-white">
                Add Room
              </button>
            </form>
          </Panel>
          <Panel title="Create Bed">
            <form className="grid gap-3" onSubmit={createBed}>
              <Select label="Room" name="roomId" required>
                <option value="">Select room</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber}
                  </option>
                ))}
              </Select>
              <Input label="Bed number" name="bedNumber" required />
              <Select label="Status" name="status">
                {["AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              <Select label="Repair status" name="repairStatus">
                {["OK", "NEEDS_REPAIR", "UNDER_REPAIR"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
              <button className="h-10 rounded-md bg-role-admin text-sm font-semibold text-white">
                Add Bed
              </button>
            </form>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function HostelAdminInquiriesPageContent() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ inquiries: Inquiry[] }>(
        "/api/v1/hostel-admin/inquiries",
      );

      setInquiries(data.inquiries);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load inquiries.");
    }
  }, []);

  useEffect(() => deferLoad(load), [load]);

  async function updateStatus(event: FormEvent<HTMLFormElement>, inquiryId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi(`/api/v1/hostel-admin/inquiries/${inquiryId}/status`, {
        body: JSON.stringify({ status: field(form, "status") }),
        method: "PATCH",
      });
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update inquiry.");
    }
  }

  async function addNote(event: FormEvent<HTMLFormElement>, inquiryId: string) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi(`/api/v1/hostel-admin/inquiries/${inquiryId}/notes`, {
        body: JSON.stringify({ note: field(form, "note") }),
        method: "POST",
      });
      event.currentTarget.reset();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not add note.");
    }
  }

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Public inquiries stored against this hostel with room preference and budget."
        icon={Inbox}
        title="Inquiries"
      />
      <Message value={message} />
      <Panel>
        {inquiries.length === 0 ? <EmptyState label="No inquiries yet." /> : null}
        <div className="grid gap-4 xl:grid-cols-2">
          {inquiries.map((inquiry) => (
            <div className="rounded-lg border border-border p-4" key={inquiry.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">{inquiry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {inquiry.phone} {inquiry.email}
                  </p>
                </div>
                <StatusBadge>{inquiry.status}</StatusBadge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                <span>Room: {inquiry.preferredRoomType || "-"}</span>
                <span>Budget: {inquiry.budgetRange || "-"}</span>
                <span>Gender: {inquiry.gender || "-"}</span>
                <span>
                  Visit:{" "}
                  {inquiry.preferredVisitDate
                    ? new Date(inquiry.preferredVisitDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <p className="mt-3 text-sm text-primary">{inquiry.message}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <form
                  className="flex gap-2"
                  onSubmit={(event) => updateStatus(event, inquiry.id)}
                >
                  <select
                    className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                    defaultValue={inquiry.status}
                    name="status"
                  >
                    {["NEW", "CONTACTED", "VISIT_SCHEDULED", "CONVERTED", "CLOSED"].map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ),
                    )}
                  </select>
                  <button className="rounded-md bg-role-admin px-3 text-sm font-semibold text-white">
                    Save
                  </button>
                </form>
                <form
                  className="flex gap-2"
                  onSubmit={(event) => addNote(event, inquiry.id)}
                >
                  <input
                    className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm"
                    name="note"
                    placeholder="Follow-up note"
                    required
                  />
                  <button className="rounded-md border border-role-admin px-3 text-sm font-semibold text-role-admin">
                    Note
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
