import { describe, expect, it } from "vitest";

import { Role } from "@/lib/roles";
import {
  destinationForRole,
  isAllowedNextPath,
  isSafeLocalPath,
  protectedRouteRuleForPath,
} from "@/lib/route-access";

describe("route access", () => {
  it("maps protected portal prefixes to the expected roles", () => {
    expect(protectedRouteRuleForPath("/platform/dashboard")?.roles).toEqual([
      Role.PLATFORM_OWNER,
    ]);
    expect(protectedRouteRuleForPath("/hostel-admin/rooms")?.roles).toEqual([
      Role.HOSTEL_OWNER,
      Role.HOSTEL_ADMIN,
      Role.WARDEN,
    ]);
    expect(protectedRouteRuleForPath("/resident/dashboard")?.roles).toEqual([
      Role.RESIDENT,
    ]);
    expect(protectedRouteRuleForPath("/guardian/dashboard")?.roles).toEqual([
      Role.GUARDIAN,
    ]);
  });

  it("does not treat same-prefix public paths as protected portal paths", () => {
    expect(protectedRouteRuleForPath("/platformer")).toBeUndefined();
    expect(protectedRouteRuleForPath("/resident-life")).toBeUndefined();
  });

  it("allows next redirects only inside the user's own portal", () => {
    expect(isAllowedNextPath(Role.HOSTEL_ADMIN, "/hostel-admin/residents")).toBe(true);
    expect(isAllowedNextPath(Role.HOSTEL_ADMIN, "/platform/dashboard")).toBe(false);
    expect(isAllowedNextPath(Role.RESIDENT, "/guardian/dashboard")).toBe(false);
  });

  it("falls back to the role landing page for unsafe or cross-role next paths", () => {
    expect(isSafeLocalPath("/resident/dashboard")).toBe(true);
    expect(isSafeLocalPath("//evil.example/login")).toBe(false);
    expect(destinationForRole(Role.RESIDENT, "//evil.example/resident/dashboard")).toBe(
      "/resident/dashboard",
    );
    expect(destinationForRole(Role.WARDEN, "/platform/dashboard")).toBe(
      "/hostel-admin/dashboard",
    );
  });
});
