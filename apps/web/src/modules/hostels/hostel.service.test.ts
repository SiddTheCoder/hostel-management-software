import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Role } from "@/lib/roles";

const serviceMocks = vi.hoisted(() => ({
  auditCreate: vi.fn(),
  bedCountDocuments: vi.fn(),
  bedFind: vi.fn(),
  bedFindOne: vi.fn(),
  bedFindOneAndUpdate: vi.fn(),
  connectToDatabase: vi.fn(),
  floorCreate: vi.fn(),
  floorFind: vi.fn(),
  floorFindOne: vi.fn(),
  hostelCreate: vi.fn(),
  hostelExists: vi.fn(),
  hostelFind: vi.fn(),
  hostelFindOne: vi.fn(),
  hostelFindOneAndUpdate: vi.fn(),
  hostelUpdateOne: vi.fn(),
  inquiryCreate: vi.fn(),
  inquiryFind: vi.fn(),
  inquiryFindOne: vi.fn(),
  inquiryFindOneAndUpdate: vi.fn(),
  inquiryNoteCreate: vi.fn(),
  roomCountDocuments: vi.fn(),
  roomCreate: vi.fn(),
  roomFind: vi.fn(),
  roomFindOne: vi.fn(),
  roomFindOneAndUpdate: vi.fn(),
  roomUpdateOne: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  connectToDatabase: serviceMocks.connectToDatabase,
}));

vi.mock("@hostel/db/models/AuditLog", () => ({
  AuditLogModel: {
    create: serviceMocks.auditCreate,
  },
}));

vi.mock("@hostel/db/models/Bed", () => ({
  BedModel: {
    countDocuments: serviceMocks.bedCountDocuments,
    find: serviceMocks.bedFind,
    findOne: serviceMocks.bedFindOne,
    findOneAndUpdate: serviceMocks.bedFindOneAndUpdate,
  },
}));

vi.mock("@hostel/db/models/Floor", () => ({
  FloorModel: {
    create: serviceMocks.floorCreate,
    find: serviceMocks.floorFind,
    findOne: serviceMocks.floorFindOne,
  },
}));

vi.mock("@hostel/db/models/Hostel", () => ({
  HostelModel: {
    create: serviceMocks.hostelCreate,
    exists: serviceMocks.hostelExists,
    find: serviceMocks.hostelFind,
    findOne: serviceMocks.hostelFindOne,
    findOneAndUpdate: serviceMocks.hostelFindOneAndUpdate,
    updateOne: serviceMocks.hostelUpdateOne,
  },
}));

vi.mock("@hostel/db/models/HostelApplication", () => ({
  HostelApplicationModel: {
    create: vi.fn(),
    findById: vi.fn(),
    findOne: vi.fn(),
    updateMany: vi.fn(),
  },
}));

vi.mock("@hostel/db/models/HostelDocument", () => ({
  HostelDocumentModel: {
    insertMany: vi.fn(),
    updateMany: vi.fn(),
  },
}));

vi.mock("@hostel/db/models/HostelVerification", () => ({
  HostelVerificationModel: {
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
  },
}));

vi.mock("@hostel/db/models/Inquiry", () => ({
  InquiryModel: {
    create: serviceMocks.inquiryCreate,
    find: serviceMocks.inquiryFind,
    findOne: serviceMocks.inquiryFindOne,
    findOneAndUpdate: serviceMocks.inquiryFindOneAndUpdate,
  },
}));

vi.mock("@hostel/db/models/InquiryNote", () => ({
  InquiryNoteModel: {
    create: serviceMocks.inquiryNoteCreate,
  },
}));

vi.mock("@hostel/db/models/Room", () => ({
  RoomModel: {
    countDocuments: serviceMocks.roomCountDocuments,
    create: serviceMocks.roomCreate,
    find: serviceMocks.roomFind,
    findOne: serviceMocks.roomFindOne,
    findOneAndUpdate: serviceMocks.roomFindOneAndUpdate,
    updateOne: serviceMocks.roomUpdateOne,
  },
}));

import {
  createPublicHostelInquiry,
  getPublicHostelBySlug,
  listPublicHostels,
} from "@/modules/hostels/hostel.service";
import {
  createHostelAdminFloor,
  createHostelAdminRoom,
} from "@/modules/hostels/hostel-spatial.service";
import { listHostelAdminInquiries } from "@/modules/hostels/hostel-inquiry.service";

const hostelId = "64f0f0f0f0f0f0f0f0f0f0f4";
const otherHostelId = "64f0f0f0f0f0f0f0f0f0f0f5";
const ownerId = "64f0f0f0f0f0f0f0f0f0f0f6";
const floorId = "64f0f0f0f0f0f0f0f0f0f0f7";

const staffPrincipal = {
  hostelIds: [hostelId],
  role: Role.HOSTEL_ADMIN,
  userId: "64f0f0f0f0f0f0f0f0f0f0f8",
};

function leanResult<T>(value: T) {
  return {
    lean: vi.fn().mockResolvedValue(value),
  };
}

function queryResult<T>(value: T) {
  return {
    lean: vi.fn().mockResolvedValue(value),
    limit: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
  };
}

function hostelRecord(overrides: Record<string, unknown> = {}) {
  return {
    _id: new Types.ObjectId(hostelId),
    contact: {
      email: "admin@sunrise.test",
      phone: "9800000000",
    },
    hostelType: "GIRLS",
    location: {
      area: "Baneshwor",
      city: "Kathmandu",
    },
    name: "Sunrise Hostel",
    ownerId: new Types.ObjectId(ownerId),
    slug: "sunrise-hostel",
    status: "PUBLISHED",
    verificationStatus: "VERIFIED",
    ...overrides,
  };
}

describe("hostel service phase 2 behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters public listings to approved published hostels and requested filters", async () => {
    serviceMocks.hostelFind.mockReturnValueOnce(queryResult([hostelRecord()]));

    await expect(
      listPublicHostels({
        area: "Baneshwor",
        facility: "wifi",
        food: "veg",
        maxPrice: 15000,
        minPrice: 8000,
        q: "sunrise",
        roomType: "single",
        type: "GIRLS",
      }),
    ).resolves.toMatchObject({
      hostels: [{ name: "Sunrise Hostel", slug: "sunrise-hostel" }],
    });

    expect(serviceMocks.hostelFind).toHaveBeenCalledWith(
      expect.objectContaining({
        "food.hasVeg": true,
        "location.area": expect.any(RegExp),
        "pricing.monthlyRentMax": { $gte: 8000 },
        "pricing.monthlyRentMin": { $lte: 15000 },
        facilities: "wifi",
        hostelType: "GIRLS",
        isDeleted: false,
        roomTypes: "single",
        status: "PUBLISHED",
        verificationStatus: "VERIFIED",
      }),
    );
  });

  it("serializes public hostel detail without owner or contact fields", async () => {
    serviceMocks.hostelFindOne.mockReturnValueOnce(leanResult(hostelRecord()));

    const result = await getPublicHostelBySlug("sunrise-hostel");

    expect(result.hostel).toMatchObject({
      id: hostelId,
      name: "Sunrise Hostel",
      slug: "sunrise-hostel",
    });
    expect(result.hostel).not.toHaveProperty("ownerId");
    expect(result.hostel).not.toHaveProperty("contact");
    expect(serviceMocks.hostelFindOne).toHaveBeenCalledWith({
      isDeleted: false,
      slug: "sunrise-hostel",
      status: "PUBLISHED",
      verificationStatus: "VERIFIED",
    });
  });

  it("creates public inquiries against visible hostels only", async () => {
    const inquiryId = new Types.ObjectId("64f0f0f0f0f0f0f0f0f0f0f9");

    serviceMocks.hostelFindOne.mockReturnValueOnce(leanResult(hostelRecord()));
    serviceMocks.inquiryCreate.mockResolvedValueOnce({
      _id: inquiryId,
      hostelId: new Types.ObjectId(hostelId),
      name: "Asha Rai",
      phone: "9800000000",
      source: "PUBLIC_WEBSITE",
      status: "NEW",
    });

    const result = await createPublicHostelInquiry(hostelId, {
      message: "Can I visit tomorrow?",
      name: "Asha Rai",
      phone: "9800000000",
    });

    expect(result.inquiry).toMatchObject({
      hostelId,
      id: inquiryId.toString(),
      status: "NEW",
    });
    expect(serviceMocks.hostelFindOne).toHaveBeenCalledWith({
      _id: new Types.ObjectId(hostelId),
      isDeleted: false,
      status: "PUBLISHED",
      verificationStatus: "VERIFIED",
    });
    expect(serviceMocks.inquiryCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        hostelId: new Types.ObjectId(hostelId),
        name: "Asha Rai",
        source: "PUBLIC_WEBSITE",
        status: "NEW",
      }),
    );
  });

  it("limits hostel-admin inquiry lists to the principal hostel ids", async () => {
    serviceMocks.inquiryFind.mockReturnValueOnce(queryResult([]));

    await listHostelAdminInquiries({}, staffPrincipal);

    expect(serviceMocks.inquiryFind).toHaveBeenCalledWith({
      hostelId: {
        $in: [new Types.ObjectId(hostelId)],
      },
      isDeleted: false,
    });
  });

  it("rejects floor creation outside the admin tenant", async () => {
    await expect(
      createHostelAdminFloor(
        {
          hostelId: otherHostelId,
          level: 1,
          name: "First Floor",
          sortOrder: 0,
        },
        staffPrincipal,
      ),
    ).rejects.toMatchObject({
      errorCode: "TENANT_ACCESS_DENIED",
      status: 403,
    });
    expect(serviceMocks.floorCreate).not.toHaveBeenCalled();
  });

  it("rejects room creation when the floor is not in the admin hostel", async () => {
    serviceMocks.floorFindOne.mockReturnValueOnce(leanResult(null));

    await expect(
      createHostelAdminRoom(
        {
          capacity: 4,
          facilities: [],
          floorId,
          repairStatus: "OK",
          roomNumber: "101",
          roomType: "quad",
          vacancyStatus: "VACANT",
        },
        staffPrincipal,
      ),
    ).rejects.toMatchObject({
      errorCode: "FLOOR_NOT_FOUND",
      status: 404,
    });
    expect(serviceMocks.roomCreate).not.toHaveBeenCalled();
  });
});
