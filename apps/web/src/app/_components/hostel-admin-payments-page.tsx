"use client";

import { Check, CreditCard, X } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState, type FormEvent } from "react";

import {
  currency,
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
  field,
  optionalField,
  PageHeader,
  type LoadState,
  type Payment,
  type PaymentProof,
  type Resident,
} from "./hostel-admin-shared";

export const HostelAdminPaymentsPage = memo(function HostelAdminPaymentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [filter, setFilter] = useState("");
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const residentById = useMemo(
    () => new Map(residents.map((resident) => [resident.id, resident])),
    [residents],
  );

  const load = useCallback(async () => {
    setState("loading");
    try {
      const [residentData, paymentData] = await Promise.all([
        browserApi<{ residents: Resident[] }>("/api/v1/hostel-admin/residents"),
        browserApi<{ payments: Payment[]; proofs: PaymentProof[] }>(
          `/api/v1/hostel-admin/payments${filter ? `?status=${filter}` : ""}`,
        ),
      ]);

      setResidents(residentData.residents);
      setPayments(paymentData.payments);
      setProofs(paymentData.proofs);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load payments.");
      setState("error");
    }
  }, [filter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const handleCreatePayment = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);

      try {
        await browserApi("/api/v1/hostel-admin/payments", {
          body: JSON.stringify({
            dueAmount: Number(field(form, "dueAmount")),
            dueDate: field(form, "dueDate"),
            month: field(form, "month"),
            residentId: field(form, "residentId"),
            remarks: optionalField(form, "remarks"),
          }),
          method: "POST",
        });
        event.currentTarget.reset();
        setMessage("Payment record created.");
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not create payment.");
      }
    },
    [load],
  );

  const reviewProof = useCallback(
    async (proofId: string, action: "approve" | "reject") => {
      const rejectionReason =
        action === "reject" ? window.prompt("Rejection reason")?.trim() : undefined;

      if (action === "reject" && !rejectionReason) {
        return;
      }

      try {
        await browserApi(`/api/v1/hostel-admin/payment-proofs/${proofId}/${action}`, {
          body: JSON.stringify(action === "reject" ? { rejectionReason } : {}),
          method: "PATCH",
        });
        setMessage(action === "approve" ? "Proof approved." : "Proof rejected.");
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not review proof.");
      }
    },
    [load],
  );

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        action={
          <select
            className="h-11 rounded-md border border-border bg-background px-3 text-sm"
            onChange={(event) => setFilter(event.target.value)}
            value={filter}
          >
            <option value="">All statuses</option>
            <option value="UNPAID">Unpaid</option>
            <option value="PENDING_PROOF">Pending proof</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        }
        description="Create monthly fee records and review resident payment proofs."
        icon={CreditCard}
        title="Payments"
      />
      {message ? (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          {message}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Panel title="Payment Records">
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? (
            <EmptyState label="Payments could not be loaded." />
          ) : null}
          {state === "ready" && payments.length === 0 ? (
            <EmptyState label="No payment records." />
          ) : null}
          {state === "ready" && payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr>
                    <th className="py-2">Resident</th>
                    <th>Month</th>
                    <th>Due</th>
                    <th>Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map((payment) => {
                    const resident = residentById.get(payment.residentId);

                    return (
                      <tr key={payment.id}>
                        <td className="py-3 font-semibold text-primary">
                          {resident
                            ? `${resident.firstName} ${resident.lastName}`
                            : payment.residentId}
                        </td>
                        <td>{payment.month}</td>
                        <td>{currency(payment.dueAmount)}</td>
                        <td>{currency(payment.paidAmount)}</td>
                        <td>
                          <StatusBadge>{payment.status}</StatusBadge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </Panel>

        <Panel title="Create Payment">
          <form className="grid gap-3" onSubmit={handleCreatePayment}>
            <Select label="Resident" name="residentId" required>
              <option value="">Select resident</option>
              {residents.map((resident) => (
                <option key={resident.id} value={resident.id}>
                  {resident.firstName} {resident.lastName}
                </option>
              ))}
            </Select>
            <Input label="Month" name="month" required type="month" />
            <Input label="Due amount" name="dueAmount" required type="number" />
            <Input label="Due date" name="dueDate" required type="date" />
            <TextArea label="Remarks" name="remarks" />
            <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
              Create Record
            </button>
          </form>
        </Panel>
      </div>

      <Panel title="Payment Proof Review">
        {proofs.length === 0 ? <EmptyState label="No proofs submitted." /> : null}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {proofs.map((proof) => (
            <div className="rounded-lg border border-border p-4" key={proof.id}>
              {proof.proofImageAssetId ? (
                <a
                  href={`/api/v1/files/${proof.proofImageAssetId}/url?variant=MEDIUM`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <img
                    alt="Payment proof"
                    className="mb-3 h-40 w-full rounded-md object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    src={`/api/v1/files/${proof.proofImageAssetId}/url?variant=THUMBNAIL`}
                  />
                </a>
              ) : null}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">
                    {residentById.get(proof.residentId)?.firstName ?? "Resident"} proof
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {proof.transactionCode}
                  </p>
                </div>
                <StatusBadge>{proof.status}</StatusBadge>
              </div>
              {proof.status === "PENDING" ? (
                <div className="mt-4 flex gap-2">
                  <button
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                    onClick={() => void reviewProof(proof.id, "approve")}
                    type="button"
                  >
                    <Check className="size-4" />
                    Approve
                  </button>
                  <button
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-rose-600 px-3 py-2 text-sm font-semibold text-white"
                    onClick={() => void reviewProof(proof.id, "reject")}
                    type="button"
                  >
                    <X className="size-4" />
                    Reject
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
});
