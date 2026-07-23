"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { platformEndpoints } from "@/lib/platform-endpoints";
import { usePortalResource } from "@/lib/portal-query";
import { Message, PageHeader, ReportGrid, type ReportRecord } from "./portal-shared";

export const PlatformReportsPageContent = React.memo(
  function PlatformReportsPageContent() {
    const reportResource = usePortalResource<{ report: ReportRecord }>(
      platformEndpoints.dashboardReport,
      { errorMessage: "Could not load report." },
    );

    const report = reportResource.data?.report ?? null;
    const message = reportResource.message;

    return (
      <div className="mx-auto max-w-[1448px] space-y-6">
        <PageHeader
          description="Platform-wide pilot readiness metrics."
          icon={BarChart3}
          title="Reports"
        />
        <Message value={message} />
        <ReportGrid report={report} />
      </div>
    );
  },
);
