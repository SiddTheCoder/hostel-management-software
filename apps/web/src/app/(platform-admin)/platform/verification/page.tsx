import { redirect } from "next/navigation";

/**
 * Verification was folded into Hostel Approvals — approval and document KYC are
 * decisions on the same queue, so they share one screen. Kept as a redirect so
 * existing links and bookmarks still land somewhere useful.
 */
export default function PlatformVerificationPage() {
  redirect("/platform/hostels");
}
