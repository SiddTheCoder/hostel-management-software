import { Role } from "@/lib/roles";

export type TenantPrincipal = {
  hostelIds?: string[];
  role: Role;
  userId: string;
};

export class TenantAccessError extends Error {
  status = 403;
  errorCode = "TENANT_ACCESS_DENIED";
}

export function canAccessHostel(principal: TenantPrincipal, hostelId: string) {
  if (principal.role === Role.PLATFORM_OWNER) {
    return true;
  }

  return Boolean(principal.hostelIds?.includes(hostelId));
}

export function assertHostelAccess(principal: TenantPrincipal, hostelId: string) {
  if (!canAccessHostel(principal, hostelId)) {
    throw new TenantAccessError("You do not have access to this hostel.");
  }
}

export function hostelScopedFilter(
  principal: TenantPrincipal,
  requestedHostelId?: string,
) {
  if (requestedHostelId) {
    assertHostelAccess(principal, requestedHostelId);
    return { hostelId: requestedHostelId };
  }

  if (principal.role === Role.PLATFORM_OWNER) {
    return {};
  }

  return { hostelId: { $in: principal.hostelIds ?? [] } };
}
