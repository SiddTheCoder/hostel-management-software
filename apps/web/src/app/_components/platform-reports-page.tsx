"use client";

import React, { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { browserApi } from "@/lib/browser-api";
import { Message, PageHeader, ReportGrid, type ReportRecord } from "./phase5-shared";

export const PlatformReportsPageContent = React.memo(
  function PlatformReportsPageContent() {
    const [report, setReport] = useState<ReportRecord | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
      async function load() {
        try {
          const data = await browserApi<{ report: ReportRecord }>(
            "/api/v1/platform/reports/dashboard",
          );

          setReport(data.report);
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not load report.");
        }
      }

      const timer = window.setTimeout(() => {
        void load();
      }, 0);

      return () => window.clearTimeout(timer);
    }, []);

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
