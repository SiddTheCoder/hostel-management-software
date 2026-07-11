"use client";

import { ReceiptText, Upload } from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  currency,
  EmptyState,
  Input,
  LoadingRows,
  Panel,
  Select,
  StatusBadge,
} from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  type LoadState,
  type Payment,
  type PaymentProof,
  ResidentHeader,
  Message,
  field,
  optionalField,
} from "./resident-shared";

export const ResidentPaymentsPageContent = memo(function ResidentPaymentsPageContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [proofs, setProofs] = useState<PaymentProof[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");
  const [proofAssetId, setProofAssetId] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);

  const proofByPaymentId = useMemo(
    () => new Map(proofs.map((proof) => [proof.paymentId, proof])),
    [proofs],
  );

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ payments: Payment[]; proofs: PaymentProof[] }>(
        "/api/v1/resident/payments",
      );

      setPayments(data.payments);
      setProofs(data.proofs);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load payments.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const handleProofFile = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    setUploadingProof(true);
    try {
      const { uploadFile, optimizeImage } = await import("@/lib/client-upload");
      const assetId = await uploadFile(file, "PRIVATE");
      optimizeImage(assetId).catch(() => {});
      setProofAssetId(assetId);
      setMessage("Proof image uploaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not upload image.");
    } finally {
      setUploadingProof(false);
    }
  }, []);

  const handleProof = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const paymentId = field(form, "paymentId");

    if (!proofAssetId) {
      setMessage("Please upload a proof image first.");
      return;
    }

    try {
      await browserApi(`/api/v1/resident/payments/${paymentId}/proof`, {
        body: JSON.stringify({
          proofImageAssetId: proofAssetId,
          transactionCode: optionalField(form, "transactionCode"),
        }),
        method: "POST",
      });
      event.currentTarget.reset();
      setProofAssetId("");
      setMessage("Proof submitted.");
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit proof.");
    }
  }, [proofAssetId, load]);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <ResidentHeader
        description="Review monthly dues and submit payment proof."
        icon={ReceiptText}
        title="Payments"
      />
      <Message value={message} />
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Panel title="Payment Records">
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? (
            <EmptyState label="Payments could not be loaded." />
          ) : null}
          {state === "ready" && payments.length === 0 ? (
            <EmptyState label="No payments." />
          ) : null}
          <div className="space-y-3">
            {payments.map((payment) => {
              const proof = proofByPaymentId.get(payment.id);

              return (
                <div className="rounded-lg border border-border p-4" key={payment.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{payment.month}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Due {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge>{payment.status}</StatusBadge>
                  </div>
                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
                    <span>Due: {currency(payment.dueAmount)}</span>
                    <span>Paid: {currency(payment.paidAmount)}</span>
                    <span>Proof: {proof?.status ?? "Not submitted"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
        <Panel title="Submit Proof">
          <form className="grid gap-3" onSubmit={handleProof}>
            <Select label="Payment" name="paymentId" required>
              <option value="">Select payment</option>
              {payments
                .filter((payment) => payment.status !== "PAID")
                .map((payment) => (
                  <option key={payment.id} value={payment.id}>
                    {payment.month} / {currency(payment.dueAmount)}
                  </option>
                ))}
            </Select>
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-foreground">Proof Image</label>
              <input
                accept="image/jpeg,image/png,image/webp"
                className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm file:mr-3 file:h-8 file:rounded-md file:border-0 file:bg-role-resident file:px-3 file:text-xs file:font-semibold file:text-white"
                disabled={uploadingProof}
                onChange={handleProofFile}
                required
                type="file"
              />
              {uploadingProof ? (
                <p className="text-xs text-muted-foreground">Uploading...</p>
              ) : proofAssetId ? (
                <p className="text-xs text-emerald-600">Image uploaded.</p>
              ) : null}
            </div>
            <input name="proofImageAssetId" type="hidden" value={proofAssetId} />
            <Input label="Transaction code" name="transactionCode" />
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-role-resident text-sm font-semibold text-white disabled:opacity-50"
              disabled={uploadingProof || !proofAssetId}
              type="submit"
            >
              <Upload className="size-4" />
              Submit Proof
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
});
