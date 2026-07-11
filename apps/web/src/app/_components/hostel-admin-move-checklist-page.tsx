"use client";

import { ClipboardCheck } from "lucide-react";
import { memo, useCallback, useEffect, useState, type FormEvent } from "react";

import { browserApi } from "@/lib/browser-api";
import { field, type Resident, Message, optionalNumber, PageHeader } from "./daily-operations-shared";
import { Input, Panel, Select, TextArea } from "@/app/_components/shared-ui";

export const HostelAdminMoveChecklistPage = memo(function HostelAdminMoveChecklistPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ residents: Resident[] }>(
        "/api/v1/hostel-admin/residents",
      );

      setResidents(data.residents);
      setSelectedResidentId((current) => current || data.residents[0]?.id || "");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load residents.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const moveIn = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);

      try {
        await browserApi(
          `/api/v1/hostel-admin/residents/${selectedResidentId}/move-in`,
          {
            body: JSON.stringify({
              bedCondition: field(form, "bedCondition"),
              depositAmount: optionalNumber(form, "depositAmount"),
              documentsCollected: field(form, "documentsCollected")
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              itemsProvided: field(form, "itemsProvided")
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              roomCondition: field(form, "roomCondition"),
              roomPhotoAssetIds: field(form, "roomPhotoAssetIds")
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              rulesAccepted: form.get("rulesAccepted") === "on",
            }),
            method: "POST",
          },
        );
        setMessage("Move-in checklist saved.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not save move-in.");
      }
    },
    [selectedResidentId],
  );

  const moveOut = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);

      try {
        await browserApi(
          `/api/v1/hostel-admin/residents/${selectedResidentId}/move-out`,
          {
            body: JSON.stringify({
              damageNotes: field(form, "damageNotes"),
              depositRefundAmount: optionalNumber(form, "depositRefundAmount"),
              depositRefundDecision: field(form, "depositRefundDecision"),
              finalReceiptAssetId: field(form, "finalReceiptAssetId"),
              itemReturnNotes: field(form, "itemReturnNotes"),
            }),
            method: "POST",
          },
        );
        setMessage("Move-out checklist saved.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not save move-out.");
      }
    },
    [selectedResidentId],
  );

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Record move-in condition and move-out settlement."
        icon={ClipboardCheck}
        title="Move-In/Move-Out"
      />
      <Message value={message} />
      <label className="grid max-w-md gap-2 text-sm font-semibold text-foreground">
        Resident
        <select
          className="h-11 rounded-md border border-border bg-background px-3 text-sm font-normal outline-none focus:border-role-admin"
          onChange={(event) => setSelectedResidentId(event.target.value)}
          value={selectedResidentId}
        >
          {residents.map((resident) => (
            <option key={resident.id} value={resident.id}>
              {resident.firstName} {resident.lastName}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Move-In">
          <form className="grid gap-3" onSubmit={moveIn}>
            <Input label="Documents collected" name="documentsCollected" />
            <Input label="Room photo asset ids" name="roomPhotoAssetIds" />
            <Input label="Deposit amount" name="depositAmount" type="number" />
            <TextArea label="Room condition" name="roomCondition" />
            <TextArea label="Bed condition" name="bedCondition" />
            <Input label="Items provided" name="itemsProvided" />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input name="rulesAccepted" type="checkbox" />
              Rules accepted
            </label>
            <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
              Save Move-In
            </button>
          </form>
        </Panel>
        <Panel title="Move-Out">
          <form className="grid gap-3" onSubmit={moveOut}>
            <TextArea label="Damage notes" name="damageNotes" />
            <TextArea label="Item return notes" name="itemReturnNotes" />
            <Input label="Refund amount" name="depositRefundAmount" type="number" />
            <Select label="Refund decision" name="depositRefundDecision">
              {["PENDING", "APPROVED", "PARTIAL", "FORFEITED"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <Input label="Final receipt asset id" name="finalReceiptAssetId" />
            <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
              Save Move-Out
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
});
