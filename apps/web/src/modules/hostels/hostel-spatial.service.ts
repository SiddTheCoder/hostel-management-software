import { Types } from "mongoose";

import type { ApiPrincipal } from "@/lib/api-auth";
import { connectToDatabase } from "@/lib/db";
import { BedModel } from "@hostel/db/models/Bed";
import { FloorModel } from "@hostel/db/models/Floor";
import { HostelModel } from "@hostel/db/models/Hostel";
import { RoomModel } from "@hostel/db/models/Room";
import type {
  bedCreateSchema,
  bedUpdateSchema,
  floorCreateSchema,
  hostelScopedListQuerySchema,
  roomCreateSchema,
  roomUpdateSchema,
} from "@/modules/hostels/hostel.validation";
import {
  auditHostelAction,
  definedUpdate,
  findScopedHostel,
  HostelServiceError,
  normalizeObjectId,
  resolveAdminHostelId,
  scopedHostelFilter,
  serializeHostel,
} from "@/modules/hostels/hostel.service";
import type { z } from "zod";

type FloorCreateInput = z.infer<typeof floorCreateSchema>;
type RoomCreateInput = z.infer<typeof roomCreateSchema>;
type RoomUpdateInput = z.infer<typeof roomUpdateSchema>;
type BedCreateInput = z.infer<typeof bedCreateSchema>;
type BedUpdateInput = z.infer<typeof bedUpdateSchema>;
type HostelScopedListQuery = z.infer<typeof hostelScopedListQuerySchema>;

type FloorRecord = {
  _id: Types.ObjectId;
  createdAt?: Date;
  description?: string;
  hostelId: Types.ObjectId;
  level: number;
  name: string;
  sortOrder?: number;
  status: "ACTIVE" | "INACTIVE";
  updatedAt?: Date;
};

type RoomRecord = {
  _id: Types.ObjectId;
  capacity: number;
  createdAt?: Date;
  facilities?: string[];
  floorId: Types.ObjectId;
  hostelId: Types.ObjectId;
  notes?: string;
  repairStatus: "OK" | "NEEDS_REPAIR" | "UNDER_REPAIR";
  roomNumber: string;
  roomType: string;
  status: "ACTIVE" | "INACTIVE";
  updatedAt?: Date;
  vacancyStatus: "VACANT" | "PARTIAL" | "FULL";
};

type BedRecord = {
  _id: Types.ObjectId;
  assignedResidentId?: Types.ObjectId;
  bedNumber: string;
  createdAt?: Date;
  floorId: Types.ObjectId;
  hostelId: Types.ObjectId;
  notes?: string;
  repairStatus: "OK" | "NEEDS_REPAIR" | "UNDER_REPAIR";
  roomId: Types.ObjectId;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED" | "MAINTENANCE";
  updatedAt?: Date;
};

function serializeFloor(floor: FloorRecord) {
  return {
    createdAt: floor.createdAt?.toISOString(),
    description: floor.description ?? "",
    hostelId: floor.hostelId.toString(),
    id: floor._id.toString(),
    level: floor.level,
    name: floor.name,
    sortOrder: floor.sortOrder ?? 0,
    status: floor.status,
    updatedAt: floor.updatedAt?.toISOString(),
  };
}

function serializeRoom(room: RoomRecord) {
  return {
    capacity: room.capacity,
    createdAt: room.createdAt?.toISOString(),
    facilities: room.facilities ?? [],
    floorId: room.floorId.toString(),
    hostelId: room.hostelId.toString(),
    id: room._id.toString(),
    notes: room.notes ?? "",
    repairStatus: room.repairStatus,
    roomNumber: room.roomNumber,
    roomType: room.roomType,
    status: room.status,
    updatedAt: room.updatedAt?.toISOString(),
    vacancyStatus: room.vacancyStatus,
  };
}

function serializeBed(bed: BedRecord) {
  return {
    assignedResidentId: bed.assignedResidentId?.toString(),
    bedNumber: bed.bedNumber,
    createdAt: bed.createdAt?.toISOString(),
    floorId: bed.floorId.toString(),
    hostelId: bed.hostelId.toString(),
    id: bed._id.toString(),
    notes: bed.notes ?? "",
    repairStatus: bed.repairStatus,
    roomId: bed.roomId.toString(),
    status: bed.status,
    updatedAt: bed.updatedAt?.toISOString(),
  };
}

async function findFloorInHostel(floorId: string, hostelId: Types.ObjectId) {
  const floor = await FloorModel.findOne({
    _id: normalizeObjectId(floorId),
    hostelId,
    isDeleted: false,
  }).lean<FloorRecord | null>();

  if (!floor) {
    throw new HostelServiceError("Floor was not found.", "FLOOR_NOT_FOUND", 404);
  }

  return floor;
}

async function findRoomInHostel(roomId: string, hostelId: Types.ObjectId) {
  const room = await RoomModel.findOne({
    _id: normalizeObjectId(roomId),
    hostelId,
    isDeleted: false,
  }).lean<RoomRecord | null>();

  if (!room) {
    throw new HostelServiceError("Room was not found.", "ROOM_NOT_FOUND", 404);
  }

  return room;
}

async function refreshCapacitySummary(hostelId: Types.ObjectId) {
  const [totalRooms, totalBeds, vacantBeds] = await Promise.all([
    RoomModel.countDocuments({ hostelId, isDeleted: false, status: "ACTIVE" }),
    BedModel.countDocuments({ hostelId, isDeleted: false }),
    BedModel.countDocuments({ hostelId, isDeleted: false, status: "AVAILABLE" }),
  ]);

  await HostelModel.updateOne(
    { _id: hostelId, isDeleted: false },
    {
      $set: {
        capacitySummary: {
          totalBeds,
          totalRooms,
          vacantBeds,
        },
      },
    },
  );
}

async function refreshRoomVacancyStatus(room: RoomRecord) {
  const occupiedBeds = await BedModel.countDocuments({
    isDeleted: false,
    roomId: room._id,
    status: { $in: ["OCCUPIED", "RESERVED"] },
  });
  const nextStatus =
    occupiedBeds === 0 ? "VACANT" : occupiedBeds >= room.capacity ? "FULL" : "PARTIAL";

  await RoomModel.updateOne(
    { _id: room._id, isDeleted: false },
    { $set: { vacancyStatus: nextStatus } },
  );
}

export async function createHostelAdminFloor(
  input: FloorCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostelId = resolveAdminHostelId(principal, input.hostelId);
  const floor = await FloorModel.create({
    ...input,
    createdBy: principal.userId,
    hostelId,
    updatedBy: principal.userId,
  });

  await auditHostelAction(principal, hostelId, "HOSTEL_FLOOR_CREATED", {
    floorId: floor._id.toString(),
  });

  return {
    floor: serializeFloor(floor),
  };
}

export async function listHostelAdminFloors(
  query: HostelScopedListQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const floors = await FloorModel.find({
    isDeleted: false,
    ...scopedHostelFilter(principal, query.hostelId),
  })
    .sort({ sortOrder: 1, level: 1 })
    .lean<FloorRecord[]>();

  return {
    floors: floors.map(serializeFloor),
  };
}

export async function createHostelAdminRoom(
  input: RoomCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostelId = resolveAdminHostelId(principal, input.hostelId);
  const floor = await findFloorInHostel(input.floorId, hostelId);
  const room = await RoomModel.create({
    ...input,
    createdBy: principal.userId,
    floorId: floor._id,
    hostelId,
    status: "ACTIVE",
    updatedBy: principal.userId,
  });

  await refreshCapacitySummary(hostelId);
  await auditHostelAction(principal, hostelId, "HOSTEL_ROOM_CREATED", {
    roomId: room._id.toString(),
  });

  return {
    room: serializeRoom(room),
  };
}

export async function listHostelAdminRooms(
  query: HostelScopedListQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const rooms = await RoomModel.find({
    isDeleted: false,
    ...scopedHostelFilter(principal, query.hostelId),
  })
    .sort({ floorId: 1, roomNumber: 1 })
    .lean<RoomRecord[]>();

  return {
    rooms: rooms.map(serializeRoom),
  };
}

export async function updateHostelAdminRoom(
  roomId: string,
  input: RoomUpdateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const existingRoom = await RoomModel.findOne({
    _id: normalizeObjectId(roomId),
    isDeleted: false,
    ...scopedHostelFilter(principal, input.hostelId),
  }).lean<RoomRecord | null>();

  if (!existingRoom) {
    throw new HostelServiceError("Room was not found.", "ROOM_NOT_FOUND", 404);
  }

  const roomUpdate = definedUpdate(input, ["hostelId"]);

  if (input.floorId) {
    const floor = await findFloorInHostel(input.floorId, existingRoom.hostelId);
    roomUpdate.floorId = floor._id;
  }

  const updatedRoom = await RoomModel.findOneAndUpdate(
    { _id: existingRoom._id, isDeleted: false },
    {
      $set: {
        ...roomUpdate,
        updatedBy: principal.userId,
      },
    },
    { new: true },
  ).lean<RoomRecord | null>();

  if (!updatedRoom) {
    throw new HostelServiceError("Room was not found.", "ROOM_NOT_FOUND", 404);
  }

  await refreshCapacitySummary(existingRoom.hostelId);
  await auditHostelAction(principal, existingRoom.hostelId, "HOSTEL_ROOM_UPDATED", {
    roomId: existingRoom._id.toString(),
  });

  return {
    room: serializeRoom(updatedRoom),
  };
}

export async function createHostelAdminBed(
  input: BedCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostelId = resolveAdminHostelId(principal, input.hostelId);
  const room = await findRoomInHostel(input.roomId, hostelId);
  const bed = await BedModel.create({
    ...input,
    assignedResidentId: input.assignedResidentId
      ? normalizeObjectId(input.assignedResidentId)
      : undefined,
    createdBy: principal.userId,
    floorId: room.floorId,
    hostelId,
    roomId: room._id,
    updatedBy: principal.userId,
  });

  await refreshRoomVacancyStatus(room);
  await refreshCapacitySummary(hostelId);
  await auditHostelAction(principal, hostelId, "HOSTEL_BED_CREATED", {
    bedId: bed._id.toString(),
    roomId: room._id.toString(),
  });

  return {
    bed: serializeBed(bed),
  };
}

export async function updateHostelAdminBed(
  bedId: string,
  input: BedUpdateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const existingBed = await BedModel.findOne({
    _id: normalizeObjectId(bedId),
    isDeleted: false,
    ...scopedHostelFilter(principal, input.hostelId),
  }).lean<BedRecord | null>();

  if (!existingBed) {
    throw new HostelServiceError("Bed was not found.", "BED_NOT_FOUND", 404);
  }

  const bedUpdate = definedUpdate(input, ["hostelId"]);
  const unsetUpdate: Record<string, ""> = {};
  let currentRoom = await findRoomInHostel(
    existingBed.roomId.toString(),
    existingBed.hostelId,
  );
  let previousRoom: RoomRecord | null = null;

  if (input.roomId) {
    const nextRoom = await findRoomInHostel(input.roomId, existingBed.hostelId);

    if (nextRoom._id.toString() !== existingBed.roomId.toString()) {
      previousRoom = currentRoom;
    }

    currentRoom = nextRoom;
    bedUpdate.floorId = nextRoom.floorId;
    bedUpdate.roomId = nextRoom._id;
  }

  if (input.assignedResidentId === null) {
    delete bedUpdate.assignedResidentId;
    unsetUpdate.assignedResidentId = "";
  } else if (input.assignedResidentId) {
    bedUpdate.assignedResidentId = normalizeObjectId(input.assignedResidentId);
  }

  const modifier: Record<string, unknown> = {
    $set: {
      ...bedUpdate,
      updatedBy: principal.userId,
    },
  };

  if (Object.keys(unsetUpdate).length > 0) {
    modifier.$unset = unsetUpdate;
  }

  const updatedBed = await BedModel.findOneAndUpdate(
    { _id: existingBed._id, isDeleted: false },
    modifier,
    { new: true },
  ).lean<BedRecord | null>();

  if (!updatedBed) {
    throw new HostelServiceError("Bed was not found.", "BED_NOT_FOUND", 404);
  }

  if (previousRoom) {
    await refreshRoomVacancyStatus(previousRoom);
  }

  await refreshRoomVacancyStatus(currentRoom);
  await refreshCapacitySummary(existingBed.hostelId);
  await auditHostelAction(principal, existingBed.hostelId, "HOSTEL_BED_UPDATED", {
    bedId: existingBed._id.toString(),
  });

  return {
    bed: serializeBed(updatedBed),
  };
}

export async function getHostelAdminRoomMap(
  query: HostelScopedListQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const hostel = await findScopedHostel(principal, query.hostelId);
  const [floors, rooms, beds] = await Promise.all([
    FloorModel.find({ hostelId: hostel._id, isDeleted: false })
      .sort({ sortOrder: 1, level: 1 })
      .lean<FloorRecord[]>(),
    RoomModel.find({ hostelId: hostel._id, isDeleted: false })
      .sort({ floorId: 1, roomNumber: 1 })
      .lean<RoomRecord[]>(),
    BedModel.find({ hostelId: hostel._id, isDeleted: false })
      .sort({ roomId: 1, bedNumber: 1 })
      .lean<BedRecord[]>(),
  ]);

  return {
    floors: floors.map((floor) => ({
      ...serializeFloor(floor),
      rooms: rooms
        .filter((room) => room.floorId.toString() === floor._id.toString())
        .map((room) => ({
          ...serializeRoom(room),
          beds: beds
            .filter((bed) => bed.roomId.toString() === room._id.toString())
            .map(serializeBed),
        })),
    })),
    hostel: serializeHostel(hostel),
  };
}
