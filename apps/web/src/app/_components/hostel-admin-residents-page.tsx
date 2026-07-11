"use client";

import { QrCode, UserPlus, Users } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import {
  currency,
  EmptyState,
  Input,
  LoadingRows,
  Panel,
  Select,
  StatusBadge,
} from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import { cn } from "@/lib/utils";

import {
  DemoDataBadge,
  field,
  optionalField,
  PageHeader,
  type LoadState,
  type Resident,
  type RoomMapBed,
  type RoomMapFloor,
  type RoomMapRoom,
} from "./hostel-admin-shared";

export const HostelAdminResidentsPage = memo(function HostelAdminResidentsPage() {
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

  const handleCreateResident = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [bedOptions, load],
  );

  const handleGenerateActivation = useCallback(async () => {
    if (!selectedResidentId) {
      return;
    }

    try {
      const result = await browserApi<{ activation: { code?: string } }>(
        `/api/v1/hostel-admin/residents/${selectedResidentId}/activation-code`,
        {
          body: JSON.stringify({ expiresInHours: 48 }),
          method: "POST",
        },
      );

      setActivationCode(result.activation.code ?? "");
      setMessage("Activation code generated.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not generate activation code.",
      );
    }
  }, [selectedResidentId]);

  const handleAddGuardian = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedResidentId) {
        return;
      }

      const form = new FormData(event.currentTarget);

      try {
        await browserApi(
          `/api/v1/hostel-admin/residents/${selectedResidentId}/guardians`,
          {
            body: JSON.stringify({
              email: optionalField(form, "email"),
              firstName: field(form, "firstName"),
              isPrimary: form.get("isPrimary") === "on",
              lastName: field(form, "lastName"),
              phone: field(form, "phone"),
              relation: field(form, "relation"),
            }),
            method: "POST",
          },
        );
        event.currentTarget.reset();
        setMessage("Guardian saved.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not save guardian.");
      }
    },
    [selectedResidentId],
  );

  const handleAddEmergencyContact = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [selectedResidentId],
  );

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
});
