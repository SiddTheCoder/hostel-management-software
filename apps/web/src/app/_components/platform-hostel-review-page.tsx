"use client";

import { Building2 } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { EmptyState, Panel } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  deferLoad,
  Hostel,
  Message,
  PageHeader,
} from "./core-portal-shared";

export const PlatformHostelReviewPageContent = memo(function PlatformHostelReviewPageContent() {
  const params = useParams<{ id: string }>();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ hostel: Hostel }>(
        `/api/v1/platform/hostels/${params.id}`,
      );

      setHostel(data.hostel);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load hostel.");
    }
  }, [params.id]);

  useEffect(() => deferLoad(load), [load]);

  return (
    <div className="mx-auto max-w-[1000px] space-y-6">
      <PageHeader
        description="Detailed platform review record for this hostel."
        icon={Building2}
        title="Hostel Verification"
      />
      <Message value={message} />
      {hostel ? (
        <Panel title={hostel.name}>
          <div className="grid gap-4 md:grid-cols-2">
            <p>Location: {hostel.location.address || hostel.location.area}</p>
            <p>Type: {hostel.hostelType}</p>
            <p>Status: {hostel.status}</p>
            <p>Verification: {hostel.verificationStatus}</p>
            <p>Phone: {hostel.contact?.phone || "-"}</p>
            <p>Email: {hostel.contact?.email || "-"}</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{hostel.description}</p>
        </Panel>
      ) : (
        <EmptyState label="Hostel detail is not loaded." />
      )}
    </div>
  );
});
