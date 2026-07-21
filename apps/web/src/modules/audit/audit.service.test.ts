import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auditFind: vi.fn(),
  connectToDatabase: vi.fn(),
  hostelFind: vi.fn(),
  userFind: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  connectToDatabase: mocks.connectToDatabase,
}));

vi.mock("@hostel/db/models/AuditLog", () => ({
  AuditLogModel: { find: mocks.auditFind },
}));

vi.mock("@hostel/db/models/User", () => ({
  UserModel: { find: mocks.userFind },
}));

vi.mock("@hostel/db/models/Hostel", () => ({
  HostelModel: { find: mocks.hostelFind },
}));

import { listPlatformAuditLogs } from "@/modules/audit/audit.service";

function auditChain(result: unknown[]) {
  return {
    sort: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    lean: vi.fn().mockResolvedValue(result),
  };
}

function refChain(result: unknown[]) {
  return {
    select: vi.fn().mockReturnThis(),
    lean: vi.fn().mockResolvedValue(result),
  };
}

describe("listPlatformAuditLogs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns newest-first logs with actor and hostel labels resolved", async () => {
    mocks.auditFind.mockReturnValue(
      auditChain([
        {
          _id: "log-1",
          action: "HOSTEL_APPROVED",
          actorId: "actor-1",
          createdAt: new Date("2026-07-20T10:00:00.000Z"),
          entityId: "hostel-1",
          entityType: "Hostel",
          hostelId: "hostel-1",
          metadata: { reason: "ok" },
        },
      ]),
    );
    mocks.userFind.mockReturnValue(
      refChain([{ _id: "actor-1", email: "owner@example.com", name: "Platform Owner" }]),
    );
    mocks.hostelFind.mockReturnValue(
      refChain([{ _id: "hostel-1", name: "Sunrise Hostel" }]),
    );

    const result = await listPlatformAuditLogs({ limit: 50 });

    expect(mocks.connectToDatabase).toHaveBeenCalled();
    expect(mocks.auditFind).toHaveBeenCalledWith({});
    expect(result.logs).toHaveLength(1);
    expect(result.logs[0]).toMatchObject({
      action: "HOSTEL_APPROVED",
      actorLabel: "Platform Owner",
      createdAt: "2026-07-20T10:00:00.000Z",
      entityType: "Hostel",
      hostelLabel: "Sunrise Hostel",
      id: "log-1",
    });
  });

  it("applies action/entityType filters and skips ref lookups when nothing to resolve", async () => {
    mocks.auditFind.mockReturnValue(auditChain([]));

    const result = await listPlatformAuditLogs({
      action: "HOSTEL_REJECTED",
      entityType: "Hostel",
    });

    expect(mocks.auditFind).toHaveBeenCalledWith({
      action: "HOSTEL_REJECTED",
      entityType: "Hostel",
    });
    expect(mocks.userFind).not.toHaveBeenCalled();
    expect(mocks.hostelFind).not.toHaveBeenCalled();
    expect(result.logs).toEqual([]);
  });

  it("falls back to the actor id when the referenced actor is missing", async () => {
    mocks.auditFind.mockReturnValue(
      auditChain([
        {
          _id: "log-2",
          action: "USER_ROLE_UPGRADED",
          actorId: "ghost",
          entityId: "u1",
          entityType: "User",
          metadata: {},
        },
      ]),
    );
    mocks.userFind.mockReturnValue(refChain([]));

    const result = await listPlatformAuditLogs();

    expect(result.logs[0].actorLabel).toBe("ghost");
    expect(result.logs[0].hostelLabel).toBeNull();
    expect(mocks.hostelFind).not.toHaveBeenCalled();
  });
});
