"use client";

import { Inbox } from "lucide-react";
import { memo, useCallback, useEffect, useState, type FormEvent } from "react";

import { EmptyState, Panel, StatusBadge } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  deferLoad,
  field,
  Inquiry,
  Message,
  PageHeader,
} from "./core-portal-shared";

export const HostelAdminInquiriesPageContent = memo(function HostelAdminInquiriesPageContent() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ inquiries: Inquiry[] }>(
        "/api/v1/hostel-admin/inquiries",
      );

      setInquiries(data.inquiries);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load inquiries.");
    }
  }, []);

  useEffect(() => deferLoad(load), [load]);

  const updateStatus = useCallback(
    async (event: FormEvent<HTMLFormElement>, inquiryId: string) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);

      try {
        await browserApi(`/api/v1/hostel-admin/inquiries/${inquiryId}/status`, {
          body: JSON.stringify({ status: field(form, "status") }),
          method: "PATCH",
        });
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not update inquiry.");
      }
    },
    [load],
  );

  const addNote = useCallback(
    async (event: FormEvent<HTMLFormElement>, inquiryId: string) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);

      try {
        await browserApi(`/api/v1/hostel-admin/inquiries/${inquiryId}/notes`, {
          body: JSON.stringify({ note: field(form, "note") }),
          method: "POST",
        });
        event.currentTarget.reset();
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not add note.");
      }
    },
    [load],
  );

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Public inquiries stored against this hostel with room preference and budget."
        icon={Inbox}
        title="Inquiries"
      />
      <Message value={message} />
      <Panel>
        {inquiries.length === 0 ? <EmptyState label="No inquiries yet." /> : null}
        <div className="grid gap-4 xl:grid-cols-2">
          {inquiries.map((inquiry) => (
            <div className="rounded-lg border border-border p-4" key={inquiry.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{inquiry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {inquiry.phone} {inquiry.email}
                  </p>
                </div>
                <StatusBadge>{inquiry.status}</StatusBadge>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                <span>Room: {inquiry.preferredRoomType || "-"}</span>
                <span>Budget: {inquiry.budgetRange || "-"}</span>
                <span>Gender: {inquiry.gender || "-"}</span>
                <span>
                  Visit:{" "}
                  {inquiry.preferredVisitDate
                    ? new Date(inquiry.preferredVisitDate).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <p className="mt-3 text-sm text-foreground">{inquiry.message}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <form
                  className="flex gap-2"
                  onSubmit={(event) => updateStatus(event, inquiry.id)}
                >
                  <select
                    className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                    defaultValue={inquiry.status}
                    name="status"
                  >
                    {["NEW", "CONTACTED", "VISIT_SCHEDULED", "CONVERTED", "CLOSED"].map(
                      (status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ),
                    )}
                  </select>
                  <button className="rounded-md bg-role-admin px-3 text-sm font-semibold text-white">
                    Save
                  </button>
                </form>
                <form
                  className="flex gap-2"
                  onSubmit={(event) => addNote(event, inquiry.id)}
                >
                  <input
                    className="h-10 min-w-0 flex-1 rounded-md border border-border bg-background px-3 text-sm"
                    name="note"
                    placeholder="Follow-up note"
                    required
                  />
                  <button className="rounded-md border border-role-admin px-3 text-sm font-semibold text-role-admin">
                    Note
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
});
