import { beforeEach, describe, expect, it, vi } from "vitest";

import { Role } from "@/lib/roles";

const serviceMocks = vi.hoisted(() => ({
  connectToDatabase: vi.fn(),
  hashPassword: vi.fn(),
  hashToken: vi.fn((token: string) => `hash:${token}`),
  refreshTokenExpiresAt: vi.fn(() => new Date("2030-01-01T00:00:00.000Z")),
  sessionFindOne: vi.fn(),
  sessionInstances: [] as Array<Record<string, unknown>>,
  sessionSave: vi.fn(),
  sessionUpdateMany: vi.fn(),
  sessionUpdateOne: vi.fn(),
  signAccessToken: vi.fn(),
  signPurposeToken: vi.fn(),
  signRefreshToken: vi.fn(),
  userCreate: vi.fn(),
  userFindOne: vi.fn(),
  verifyAccessToken: vi.fn(),
  verifyPassword: vi.fn(),
  verifyPurposeToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  connectToDatabase: serviceMocks.connectToDatabase,
}));

vi.mock("@/lib/password", () => ({
  hashPassword: serviceMocks.hashPassword,
  verifyPassword: serviceMocks.verifyPassword,
}));

vi.mock("@/lib/auth", () => ({
  hashToken: serviceMocks.hashToken,
  refreshTokenExpiresAt: serviceMocks.refreshTokenExpiresAt,
  signAccessToken: serviceMocks.signAccessToken,
  signPurposeToken: serviceMocks.signPurposeToken,
  signRefreshToken: serviceMocks.signRefreshToken,
  verifyAccessToken: serviceMocks.verifyAccessToken,
  verifyPurposeToken: serviceMocks.verifyPurposeToken,
  verifyRefreshToken: serviceMocks.verifyRefreshToken,
}));

vi.mock("@hostel/db/models/Session", () => {
  class MockSessionModel {
    static findOne = serviceMocks.sessionFindOne;
    static updateMany = serviceMocks.sessionUpdateMany;
    static updateOne = serviceMocks.sessionUpdateOne;

    _id = `session-${serviceMocks.sessionInstances.length + 1}`;
    refreshTokenHash: string | undefined;
    save = serviceMocks.sessionSave;

    constructor(data: Record<string, unknown>) {
      Object.assign(this, data);
      serviceMocks.sessionInstances.push(this as unknown as Record<string, unknown>);
    }
  }

  return { SessionModel: MockSessionModel };
});

vi.mock("@hostel/db/models/User", () => ({
  UserModel: {
    create: serviceMocks.userCreate,
    findOne: serviceMocks.userFindOne,
  },
}));

import { login, logout, refreshAccessToken } from "@/modules/auth/auth.service";

function createUser(overrides: Record<string, unknown> = {}) {
  return {
    _id: "user-1",
    email: "owner@example.com",
    emailVerified: true,
    emailVerifiedAt: new Date("2026-01-01T00:00:00.000Z"),
    hostelIds: [],
    name: "Platform Owner",
    passwordHash: "password-hash",
    phone: null,
    role: Role.SUPERADMIN,
    save: vi.fn(),
    status: "ACTIVE",
    ...overrides,
  };
}

function createSession(overrides: Record<string, unknown> = {}) {
  return {
    _id: "session-1",
    refreshTokenHash: "pending",
    save: vi.fn(),
    ...overrides,
  };
}

describe("auth service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    serviceMocks.sessionInstances.length = 0;
    serviceMocks.signAccessToken.mockResolvedValue("access-token");
    serviceMocks.signRefreshToken.mockResolvedValue("refresh-token");
  });

  it("logs in a valid user and creates a hashed refresh session", async () => {
    const user = createUser();

    serviceMocks.userFindOne.mockReturnValueOnce({
      select: vi.fn().mockResolvedValue(user),
    });
    serviceMocks.verifyPassword.mockResolvedValue(true);

    await expect(
      login({ identifier: "owner@example.com", password: "ChangeMe123!" }),
    ).resolves.toMatchObject({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        email: "owner@example.com",
        role: Role.SUPERADMIN,
      },
    });

    const session = serviceMocks.sessionInstances.at(-1);

    expect(session?.refreshTokenHash).toBe("hash:refresh-token");
    expect(serviceMocks.sessionSave).toHaveBeenCalled();
    expect(user.save).toHaveBeenCalled();
  });

  it("blocks login when the email is not verified", async () => {
    const user = createUser({ emailVerified: false, emailVerifiedAt: undefined });

    serviceMocks.userFindOne.mockReturnValueOnce({
      select: vi.fn().mockResolvedValue(user),
    });
    serviceMocks.verifyPassword.mockResolvedValue(true);

    await expect(
      login({ identifier: "owner@example.com", password: "ChangeMe123!" }),
    ).rejects.toMatchObject({
      errorCode: "EMAIL_NOT_VERIFIED",
      status: 403,
    });
  });

  it("rejects a wrong password", async () => {
    serviceMocks.userFindOne.mockReturnValueOnce({
      select: vi.fn().mockResolvedValue(createUser()),
    });
    serviceMocks.verifyPassword.mockResolvedValue(false);

    await expect(
      login({ identifier: "owner@example.com", password: "wrong-password" }),
    ).rejects.toMatchObject({
      errorCode: "INVALID_CREDENTIALS",
    });
  });

  it("rotates refresh tokens when refreshing an access token", async () => {
    const session = createSession({ refreshTokenHash: "hash:old-refresh-token" });

    serviceMocks.verifyRefreshToken.mockResolvedValue({
      role: Role.SUPERADMIN,
      sessionId: "session-1",
      sub: "user-1",
      tokenType: "refresh",
    });
    serviceMocks.sessionFindOne.mockResolvedValue(session);
    serviceMocks.userFindOne.mockResolvedValue(createUser());
    serviceMocks.signAccessToken.mockResolvedValue("next-access-token");
    serviceMocks.signRefreshToken.mockResolvedValue("next-refresh-token");

    await expect(refreshAccessToken("old-refresh-token")).resolves.toMatchObject({
      accessToken: "next-access-token",
      refreshToken: "next-refresh-token",
    });
    expect(session.refreshTokenHash).toBe("hash:next-refresh-token");
    expect(session.save).toHaveBeenCalled();
  });

  it("revokes a refresh session on logout", async () => {
    await logout("refresh-token");

    expect(serviceMocks.sessionUpdateOne).toHaveBeenCalledWith(
      { refreshTokenHash: "hash:refresh-token", revokedAt: null },
      { $set: { revokedAt: expect.any(Date) } },
    );
  });
});
