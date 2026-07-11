"use client";

import { BedDouble } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import { EmptyState, Input, Panel, Select, StatusBadge } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  csvField,
  deferLoad,
  field,
  Message,
  numberField,
  PageHeader,
  RoomMapFloor,
} from "./core-portal-shared";

export const HostelAdminRoomsPageContent = memo(function HostelAdminRoomsPageContent() {
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

  const createFloor = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [load],
  );

  const createRoom = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [load],
  );

  const createBed = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
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
    },
    [load],
  );

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
});
