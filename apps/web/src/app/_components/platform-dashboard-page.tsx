"use client";

import { LayoutDashboard } from "lucide-react";
import { memo, useEffect, useState } from "react";

import { LoadingRows, Panel } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  deferLoad,
  Hostel,
  HostelTable,
  LoadState,
  Message,
  PageHeader,
  ReportGrid,
  ReportRecord,
} from "./core-portal-shared";

export const PlatformDashboardPageContent = memo(function PlatformDashboardPageContent() {
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<LoadState>("idle");

  useEffect(() => {
    async function load() {
      setState("loading");
      try {
        const [reportData, hostelData] = await Promise.all([
          browserApi<{ report: ReportRecord }>("/api/v1/platform/reports/dashboard"),
          browserApi<{ hostels: Hostel[] }>("/api/v1/platform/hostels"),
        ]);

        setReport(reportData.report);
        setHostels(hostelData.hostels.slice(0, 8));
        setState("ready");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load dashboard.");
        setState("error");
      }
    }

    return deferLoad(load);
  }, []);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Platform-wide live metrics, approvals, and moderation status."
        icon={LayoutDashboard}
        title="Platform Dashboard"
      />
      <Message value={message} />
      {state === "loading" ? <LoadingRows /> : null}
      <ReportGrid report={report} />
      <Panel title="Recent Hostels">
        <HostelTable hostels={hostels} />
      </Panel>
    </div>
  );
});
