"use client";

import { LayoutDashboard } from "lucide-react";
import { memo, useEffect, useState } from "react";

import { browserApi } from "@/lib/browser-api";
import {
  deferLoad,
  Message,
  PageHeader,
  ReportGrid,
  ReportRecord,
} from "./core-portal-shared";

export const HostelAdminDashboardPageContent = memo(function HostelAdminDashboardPageContent() {
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await browserApi<{ report: ReportRecord }>(
          "/api/v1/hostel-admin/reports/dashboard",
        );

        setReport(data.report);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
      }
    }

    return deferLoad(load);
  }, []);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Live hostel-scoped operations metrics from the database."
        icon={LayoutDashboard}
        title="Hostel Dashboard"
      />
      <Message value={message} />
      <ReportGrid report={report} />
    </div>
  );
});
