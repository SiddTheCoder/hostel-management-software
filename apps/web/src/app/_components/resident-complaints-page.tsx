"use client";

import { MessageSquareWarning, Send } from "lucide-react";
import { memo, useCallback, useEffect, useState, type FormEvent } from "react";

import {
  EmptyState,
  Input,
  LoadingRows,
  Panel,
  Select,
  StatusBadge,
  TextArea,
} from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  type Complaint,
  type LoadState,
  ResidentHeader,
  Message,
  field,
} from "./resident-shared";

export const ResidentComplaintsPageContent = memo(function ResidentComplaintsPageContent() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ complaints: Complaint[] }>(
        "/api/v1/resident/complaints",
      );

      setComplaints(data.complaints);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load complaints.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const handleCreateComplaint = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/resident/complaints", {
        body: JSON.stringify({
          attachmentAssetIds: field(form, "attachmentAssetIds")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          category: field(form, "category"),
          description: field(form, "description"),
          isAnonymous: form.get("isAnonymous") === "on",
          title: field(form, "title"),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setMessage("Complaint submitted.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit complaint.");
    }
  }, [load]);

  const confirmResolution = useCallback(async (complaintId: string) => {
    const note = window.prompt("Optional confirmation note")?.trim();

    try {
      await browserApi(`/api/v1/resident/complaints/${complaintId}/confirm-resolution`, {
        body: JSON.stringify(note ? { note } : {}),
        method: "PATCH",
      });
      setMessage("Resolution confirmed.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not confirm resolution.",
      );
    }
  }, [load]);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <ResidentHeader
        description="Report hostel issues and track staff responses."
        icon={MessageSquareWarning}
        title="Complaints"
      />
      <Message value={message} />

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="My Complaints">
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? (
            <EmptyState label="Complaints could not be loaded." />
          ) : null}
          {state === "ready" && complaints.length === 0 ? (
            <EmptyState label="No complaints submitted." />
          ) : null}
          <div className="space-y-3">
            {complaints.map((complaint) => (
              <div className="rounded-lg border border-border p-4" key={complaint.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{complaint.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {complaint.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge>{complaint.status}</StatusBadge>
                    <StatusBadge>{complaint.category}</StatusBadge>
                    {complaint.isAnonymous ? <StatusBadge>ANONYMOUS</StatusBadge> : null}
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                  <span>
                    Created:{" "}
                    {complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleDateString()
                      : "-"}
                  </span>
                  <span>SLA: {new Date(complaint.slaDueAt).toLocaleDateString()}</span>
                  <span>
                    Attachments:{" "}
                    {complaint.attachments.length > 0
                      ? complaint.attachments.map((item) => item.fileAssetId).join(", ")
                      : "None"}
                  </span>
                </div>
                {complaint.adminResponse ? (
                  <div className="mt-4 rounded-md bg-muted p-3 text-sm text-foreground">
                    {complaint.adminResponse}
                  </div>
                ) : null}
                {complaint.status === "RESOLVED" && !complaint.confirmedAt ? (
                  <button
                    className="mt-4 rounded-md bg-role-resident px-3 py-2 text-sm font-semibold text-white"
                    onClick={() => void confirmResolution(complaint.id)}
                    type="button"
                  >
                    Confirm Resolution
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Submit Complaint">
          <form className="grid gap-3" onSubmit={handleCreateComplaint}>
            <Input label="Title" name="title" required />
            <Select label="Category" name="category" required>
              {[
                "FOOD",
                "ROOM",
                "MAINTENANCE",
                "SAFETY",
                "PAYMENT",
                "STAFF",
                "NOISE",
                "OTHER",
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <TextArea label="Description" name="description" />
            <Input label="Attachment asset ids" name="attachmentAssetIds" />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input name="isAnonymous" type="checkbox" />
              Submit anonymously
            </label>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-role-resident text-sm font-semibold text-white">
              <Send className="size-4" />
              Submit
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
});
