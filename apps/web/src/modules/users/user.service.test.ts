import { beforeEach, describe, expect, it, vi } from "vitest";

import { Role } from "@/lib/roles";

const mocks = vi.hoisted(() => ({
  auditCreate: vi.fn(),
  connectToDatabase: vi.fn(),
  hashPassword: vi.fn(async (value: string) => `hash:${value}`),
  sendEmail: vi.fn(async () => ({ sent: true, id: "email-1" })),
  userCreate: vi.fn(),
  userFindOne: vi.fn(),
  userUpdateOne: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  connectToDatabase: mocks.connectToDatabase,
}));

vi.mock("@/lib/password", () => ({
  hashPassword: mocks.hashPassword,
}));

vi.mock("@hostel/db/models/User", () => ({
  UserModel: {
    create: mocks.userCreate,
    find: vi.fn(),
    findOne: mocks.userFindOne,
    updateOne: mocks.userUpdateOne,
  },
}));

vi.mock("@hostel/db/models/AuditLog", () => ({
  AuditLogModel: {
    create: mocks.auditCreate,
  },
}));

vi.mock("@hostel/shared/email/sender", () => ({
  sendEmail: mocks.sendEmail,
}));

import { registerOrUpgradeUserByEmail } from "@/modules/users/user.service";

function mockExistingUser(overrides: Record<string, unknown> = {}) {
  return {
    _id: "user-1",
    email: "test@example.com",
    hostelIds: [],
    mustChangePassword: false,
    passwordHash: "existing-hash",
    role: Role.PUBLIC,
    save: vi.fn(),
    ...overrides,
  };
}

function mockFindOneResult(user: Record<string, unknown> | null) {
  mocks.userFindOne.mockReturnValueOnce({
    select: vi.fn().mockResolvedValue(user),
  });
}

describe("registerOrUpgradeUserByEmail (ARCHITECTURE.md §3.2)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a new account with a temporary password when the email is unknown", async () => {
    mockFindOneResult(null);
    mocks.userCreate.mockImplementation(async (data: Record<string, unknown>) => ({
      _id: "user-new",
      ...data,
    }));

    const result = await registerOrUpgradeUserByEmail({
      email: "new@example.com",
      name: "New Admin",
      performedBy: "actor-1",
      role: Role.HOSTEL_ADMIN,
    });

    expect(result.created).toBe(true);
    expect(result.upgraded).toBe(false);
    expect(result.temporaryPassword).toBeTruthy();
    expect(mocks.userCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "new@example.com",
        mustChangePassword: true,
        role: Role.HOSTEL_ADMIN,
      }),
    );
    // Credentials email carries the temporary password
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "new@example.com" }),
    );
    expect(mocks.auditCreate).toHaveBeenCalledWith(
      expect.objectContaining({ action: "USER_ACCOUNT_ISSUED" }),
    );
  });

  it("upgrades an existing PUBLIC account in place without touching credentials", async () => {
    const existing = mockExistingUser();
    mockFindOneResult(existing);

    const result = await registerOrUpgradeUserByEmail({
      email: "test@example.com",
      performedBy: "actor-1",
      role: Role.RESIDENT,
    });

    expect(result.created).toBe(false);
    expect(result.upgraded).toBe(true);
    expect(result.temporaryPassword).toBeNull();
    expect(existing.role).toBe(Role.RESIDENT);
    expect(existing.passwordHash).toBe("existing-hash");
    expect(existing.save).toHaveBeenCalled();
    expect(mocks.userCreate).not.toHaveBeenCalled();
    expect(mocks.auditCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "USER_ROLE_UPGRADED",
        metadata: expect.objectContaining({ previousRole: Role.PUBLIC }),
      }),
    );
  });

  it("issues a temporary password when upgrading a Google-only PUBLIC account", async () => {
    const existing = mockExistingUser({ passwordHash: undefined });
    mockFindOneResult(existing);

    const result = await registerOrUpgradeUserByEmail({
      email: "test@example.com",
      role: Role.RESIDENT,
    });

    expect(result.upgraded).toBe(true);
    expect(result.temporaryPassword).toBeTruthy();
    expect(existing.mustChangePassword).toBe(true);
    expect(existing.passwordHash).toContain("hash:");
  });

  it("rotates to a temporary password when upgrading PUBLIC -> HOSTEL_ADMIN (§3.2 safeguard)", async () => {
    const existing = mockExistingUser({ passwordHash: "existing-hash" });
    mockFindOneResult(existing);

    const result = await registerOrUpgradeUserByEmail({
      email: "test@example.com",
      performedBy: "actor-1",
      role: Role.HOSTEL_ADMIN,
    });

    expect(result.upgraded).toBe(true);
    // A high-privilege upgrade must not be usable with the un-verified
    // pre-existing password; a fresh temporary password gates mailbox proof.
    expect(result.temporaryPassword).toBeTruthy();
    expect(existing.mustChangePassword).toBe(true);
    expect(existing.passwordHash).toContain("hash:");
    expect(existing.passwordHash).not.toBe("existing-hash");
    // Credentials email (carrying the temp password) is sent, not the silent
    // "account upgraded" notice.
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: "test@example.com" }),
    );
  });

  it("rejects when the email already has a different non-PUBLIC role", async () => {
    mockFindOneResult(mockExistingUser({ role: Role.HOSTEL_ADMIN }));

    await expect(
      registerOrUpgradeUserByEmail({
        email: "test@example.com",
        role: Role.RESIDENT,
      }),
    ).rejects.toMatchObject({
      errorCode: "EMAIL_ALREADY_HAS_ROLE",
      status: 409,
    });
    expect(mocks.userCreate).not.toHaveBeenCalled();
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("is idempotent for the same role and links the hostel", async () => {
    mockFindOneResult(mockExistingUser({ role: Role.HOSTEL_ADMIN }));

    const result = await registerOrUpgradeUserByEmail({
      email: "test@example.com",
      hostelId: "hostel-9",
      role: Role.HOSTEL_ADMIN,
    });

    expect(result.created).toBe(false);
    expect(result.upgraded).toBe(false);
    expect(mocks.userUpdateOne).toHaveBeenCalledWith(
      { _id: "user-1" },
      { $addToSet: { hostelIds: "hostel-9" } },
    );
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("never issues SUPERADMIN or PUBLIC through admin registration", async () => {
    await expect(
      registerOrUpgradeUserByEmail({
        email: "test@example.com",
        role: Role.SUPERADMIN as never,
      }),
    ).rejects.toMatchObject({ errorCode: "ROLE_NOT_ISSUABLE" });
  });
});
