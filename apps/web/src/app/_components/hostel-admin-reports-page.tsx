"use client";

import React, { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { Panel } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import { Message, PageHeader, ReportGrid, type ReportRecord } from "./phase5-shared";

export const HostelAdminReportsPageContent = React.memo(
  function HostelAdminReportsPageContent() {
    const [dashboard, setDashboard] = useState<ReportRecord | null>(null);
    const [payments, setPayments] = useState<ReportRecord | null>(null);
    const [complaints, setComplaints] = useState<ReportRecord | null>(null);
    const [maintenance, setMaintenance] = useState<ReportRecord | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
      async function load() {
        try {
          const [dashboardData, paymentsData, complaintsData, maintenanceData] =
            await Promise.all([
              browserApi<{ report: ReportRecord }>(
                "/api/v1/hostel-admin/reports/dashboard",
              ),
              browserApi<{ report: ReportRecord }>("/api/v1/hostel-admin/reports/payments"),
              browserApi<{ report: ReportRecord }>(
                "/api/v1/hostel-admin/reports/complaints",
              ),
              browserApi<{ report: ReportRecord }>(
                "/api/v1/hostel-admin/reports/maintenance",
              ),
            ]);

          setDashboard(dashboardData.report);
          setPayments(paymentsData.report);
          setComplaints(complaintsData.report);
          setMaintenance(maintenanceData.report);
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not load reports.");
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
          description="Hostel-scoped operational reports and pilot metrics."
          icon={BarChart3}
          title="Reports"
        />
        <Message value={message} />
        <Panel title="Dashboard">
          <ReportGrid report={dashboard} />
        </Panel>
        <div className="grid gap-5 xl:grid-cols-3">
          <Panel title="Payments">
            <ReportGrid report={payments} />
          </Panel>
          <Panel title="Complaints">
            <ReportGrid report={complaints} />
          </Panel>
          <Panel title="Maintenance">
            <ReportGrid report={maintenance} />
          </Panel>
        </div>
      </div>
    );
  },
);
