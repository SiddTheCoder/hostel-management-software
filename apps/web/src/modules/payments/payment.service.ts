import { Types } from "mongoose";
import type { z } from "zod";

import type { ApiPrincipal } from "@/lib/api-auth";
import { connectToDatabase } from "@/lib/db";
import { assertHostelAccess } from "@/lib/tenant";
import { AuditLogModel } from "@/models/AuditLog";
import { PaymentModel } from "@/models/Payment";
import { PaymentProofModel } from "@/models/PaymentProof";
import { ReceiptModel } from "@/models/Receipt";
import { ResidentModel } from "@/models/Resident";
import {
  findCurrentResident,
  normalizeObjectId,
  serializeResidentSummary,
  type ResidentRecord,
} from "@/modules/residents/resident-access";
import type {
  paymentCreateSchema,
  paymentListQuerySchema,
  paymentProofReviewSchema,
  paymentProofSubmitSchema,
  paymentUpdateSchema,
} from "@/modules/payments/payment.validation";

type PaymentCreateInput = z.infer<typeof paymentCreateSchema>;
type PaymentUpdateInput = z.infer<typeof paymentUpdateSchema>;
type PaymentListQuery = z.infer<typeof paymentListQuerySchema>;
type PaymentProofSubmitInput = z.infer<typeof paymentProofSubmitSchema>;
type PaymentProofReviewInput = z.infer<typeof paymentProofReviewSchema>;

type PaymentStatus = "UNPAID" | "PAID" | "PARTIAL" | "OVERDUE" | "PENDING_PROOF";
type PaymentMethod = "CASH" | "ESEWA" | "KHALTI" | "FONEPAY" | "BANK_TRANSFER" | "OTHER";
type ProofStatus = "PENDING" | "APPROVED" | "REJECTED";

type PaymentRecord = {
  _id: Types.ObjectId;
  createdAt?: Date;
  dueAmount: number;
  dueDate: Date;
  hostelId: Types.ObjectId;
  month: string;
  paidAmount: number;
  paidDate?: Date;
  paymentMethod?: PaymentMethod;
  remarks?: string;
  residentId: Types.ObjectId;
  status: PaymentStatus;
  updatedAt?: Date;
};

type PaymentProofRecord = {
  _id: Types.ObjectId;
  createdAt?: Date;
  hostelId: Types.ObjectId;
  paymentId: Types.ObjectId;
  proofImageAssetId: string;
  rejectionReason?: string;
  residentId: Types.ObjectId;
  reviewedAt?: Date;
  reviewedBy?: Types.ObjectId;
  status: ProofStatus;
  submittedAt: Date;
  submittedBy: Types.ObjectId;
  transactionCode?: string;
};

type ReceiptRecord = {
  _id: Types.ObjectId;
  amount: number;
  hostelId: Types.ObjectId;
  issuedAt: Date;
  issuedBy: Types.ObjectId;
  month: string;
  paymentId: Types.ObjectId;
  receiptNumber: string;
  residentId: Types.ObjectId;
};

export class PaymentServiceError extends Error {
  constructor(
    message: string,
    public errorCode = "PAYMENT_ERROR",
    public status = 400,
  ) {
    super(message);
  }
}

function normalizeObjectIds(values: string[]) {
  return values.map((value) => normalizeObjectId(value, "hostel id"));
}

function resolveAdminHostelId(principal: ApiPrincipal, requestedHostelId?: string) {
  if (requestedHostelId) {
    assertHostelAccess(principal, requestedHostelId);
    return normalizeObjectId(requestedHostelId, "hostel id");
  }

  if (principal.hostelIds.length === 1) {
    return normalizeObjectId(principal.hostelIds[0], "hostel id");
  }

  throw new PaymentServiceError(
    "A hostelId is required for this hostel admin action.",
    "HOSTEL_SCOPE_REQUIRED",
    422,
  );
}

function scopedHostelFilter(principal: ApiPrincipal, requestedHostelId?: string) {
  if (requestedHostelId) {
    return { hostelId: resolveAdminHostelId(principal, requestedHostelId) };
  }

  return {
    hostelId: {
      $in: normalizeObjectIds(principal.hostelIds),
    },
  };
}

function definedUpdate(input: Record<string, unknown>, omittedKeys: string[] = []) {
  return Object.fromEntries(
    Object.entries(input).filter(
      ([key, value]) => value !== undefined && !omittedKeys.includes(key),
    ),
  );
}

function serializePayment(payment: PaymentRecord) {
  return {
    createdAt: payment.createdAt?.toISOString(),
    dueAmount: payment.dueAmount,
    dueDate: payment.dueDate.toISOString(),
    hostelId: payment.hostelId.toString(),
    id: payment._id.toString(),
    month: payment.month,
    paidAmount: payment.paidAmount,
    paidDate: payment.paidDate?.toISOString(),
    paymentMethod: payment.paymentMethod,
    remarks: payment.remarks ?? "",
    residentId: payment.residentId.toString(),
    status: payment.status,
    updatedAt: payment.updatedAt?.toISOString(),
  };
}

function serializePaymentProof(proof: PaymentProofRecord) {
  return {
    createdAt: proof.createdAt?.toISOString(),
    hostelId: proof.hostelId.toString(),
    id: proof._id.toString(),
    paymentId: proof.paymentId.toString(),
    proofImageAssetId: proof.proofImageAssetId,
    rejectionReason: proof.rejectionReason ?? "",
    residentId: proof.residentId.toString(),
    reviewedAt: proof.reviewedAt?.toISOString(),
    reviewedBy: proof.reviewedBy?.toString(),
    status: proof.status,
    submittedAt: proof.submittedAt.toISOString(),
    submittedBy: proof.submittedBy.toString(),
    transactionCode: proof.transactionCode ?? "",
  };
}

function serializeReceipt(receipt: ReceiptRecord) {
  return {
    amount: receipt.amount,
    hostelId: receipt.hostelId.toString(),
    id: receipt._id.toString(),
    issuedAt: receipt.issuedAt.toISOString(),
    issuedBy: receipt.issuedBy.toString(),
    month: receipt.month,
    paymentId: receipt.paymentId.toString(),
    receiptNumber: receipt.receiptNumber,
    residentId: receipt.residentId.toString(),
  };
}

async function auditPaymentAction(
  principal: ApiPrincipal,
  hostelId: Types.ObjectId,
  entityId: Types.ObjectId,
  entityType: string,
  action: string,
  metadata: Record<string, unknown> = {},
) {
  await AuditLogModel.create({
    action,
    actorId: principal.userId,
    entityId: entityId.toString(),
    entityType,
    hostelId,
    metadata,
  });
}

async function findAdminResident(
  residentId: string,
  principal: ApiPrincipal,
  requestedHostelId?: string,
) {
  const resident = await ResidentModel.findOne({
    _id: normalizeObjectId(residentId, "resident id"),
    isDeleted: false,
    ...scopedHostelFilter(principal, requestedHostelId),
  }).lean<ResidentRecord | null>();

  if (!resident) {
    throw new PaymentServiceError("Resident was not found.", "RESIDENT_NOT_FOUND", 404);
  }

  return resident;
}

async function findAdminPayment(
  paymentId: string,
  principal: ApiPrincipal,
  requestedHostelId?: string,
) {
  const payment = await PaymentModel.findOne({
    _id: normalizeObjectId(paymentId, "payment id"),
    ...scopedHostelFilter(principal, requestedHostelId),
  }).lean<PaymentRecord | null>();

  if (!payment) {
    throw new PaymentServiceError("Payment was not found.", "PAYMENT_NOT_FOUND", 404);
  }

  return payment;
}

async function findAdminPaymentProof(
  proofId: string,
  principal: ApiPrincipal,
  requestedHostelId?: string,
) {
  const proof = await PaymentProofModel.findOne({
    _id: normalizeObjectId(proofId, "payment proof id"),
    ...scopedHostelFilter(principal, requestedHostelId),
  }).lean<PaymentProofRecord | null>();

  if (!proof) {
    throw new PaymentServiceError(
      "Payment proof was not found.",
      "PAYMENT_PROOF_NOT_FOUND",
      404,
    );
  }

  return proof;
}

export async function generateReceipt(payment: PaymentRecord, principal: ApiPrincipal) {
  const existingReceipt = await ReceiptModel.findOne({
    paymentId: payment._id,
    residentId: payment.residentId,
  }).lean<ReceiptRecord | null>();

  if (existingReceipt) {
    return existingReceipt;
  }

  const receiptNumber = `HH-${payment.month}-${payment._id.toString().slice(-6).toUpperCase()}`;

  return ReceiptModel.create({
    amount: payment.paidAmount,
    hostelId: payment.hostelId,
    issuedBy: principal.userId,
    month: payment.month,
    paymentId: payment._id,
    receiptNumber,
    residentId: payment.residentId,
  }) as Promise<ReceiptRecord>;
}

export async function createPaymentRecord(
  input: PaymentCreateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const resident = await findAdminResident(input.residentId, principal, input.hostelId);
  const payment = await PaymentModel.create({
    ...input,
    createdBy: principal.userId,
    hostelId: resident.hostelId,
    residentId: resident._id,
    updatedBy: principal.userId,
  });

  await auditPaymentAction(
    principal,
    resident.hostelId,
    payment._id,
    "Payment",
    "PAYMENT_CREATED",
    { residentId: resident._id.toString(), status: input.status },
  );

  return {
    payment: serializePayment(payment as PaymentRecord),
    resident: serializeResidentSummary(resident),
  };
}

export async function listPayments(query: PaymentListQuery, principal: ApiPrincipal) {
  await connectToDatabase();

  const filter: Record<string, unknown> = {
    ...scopedHostelFilter(principal, query.hostelId),
  };

  if (query.residentId) {
    filter.residentId = normalizeObjectId(query.residentId, "resident id");
  }

  if (query.month) {
    filter.month = query.month;
  }

  if (query.status) {
    filter.status = query.status;
  }

  const payments = await PaymentModel.find(filter)
    .sort({ dueDate: -1 })
    .limit(100)
    .lean<PaymentRecord[]>();
  const proofs = await PaymentProofModel.find({
    paymentId: { $in: payments.map((payment) => payment._id) },
  })
    .sort({ submittedAt: -1 })
    .lean<PaymentProofRecord[]>();

  return {
    payments: payments.map(serializePayment),
    proofs: proofs.map(serializePaymentProof),
  };
}

export async function updatePaymentRecord(
  paymentId: string,
  input: PaymentUpdateInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const payment = await findAdminPayment(paymentId, principal, input.hostelId);
  const update = definedUpdate(input, ["hostelId"]);
  const updatedPayment = await PaymentModel.findOneAndUpdate(
    { _id: payment._id },
    {
      $set: {
        ...update,
        updatedBy: principal.userId,
      },
    },
    { new: true },
  ).lean<PaymentRecord | null>();

  if (!updatedPayment) {
    throw new PaymentServiceError("Payment was not found.", "PAYMENT_NOT_FOUND", 404);
  }

  let receipt: ReceiptRecord | null = null;

  if (updatedPayment.status === "PAID") {
    receipt = await generateReceipt(updatedPayment, principal);
  }

  await auditPaymentAction(
    principal,
    payment.hostelId,
    payment._id,
    "Payment",
    "PAYMENT_UPDATED",
    { previousStatus: payment.status, status: updatedPayment.status },
  );

  return {
    payment: serializePayment(updatedPayment),
    receipt: receipt ? serializeReceipt(receipt) : null,
  };
}

export async function listResidentPayments(principal: ApiPrincipal) {
  await connectToDatabase();

  const resident = await findCurrentResident(principal);
  const payments = await PaymentModel.find({
    hostelId: resident.hostelId,
    residentId: resident._id,
  })
    .sort({ dueDate: -1 })
    .lean<PaymentRecord[]>();
  const proofs = await PaymentProofModel.find({
    residentId: resident._id,
    paymentId: { $in: payments.map((payment) => payment._id) },
  })
    .sort({ submittedAt: -1 })
    .lean<PaymentProofRecord[]>();

  return {
    payments: payments.map(serializePayment),
    proofs: proofs.map(serializePaymentProof),
    resident: serializeResidentSummary(resident),
  };
}

export async function submitPaymentProof(
  paymentId: string,
  input: PaymentProofSubmitInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const resident = await findCurrentResident(principal);
  const payment = await PaymentModel.findOne({
    _id: normalizeObjectId(paymentId, "payment id"),
    hostelId: resident.hostelId,
    residentId: resident._id,
  }).lean<PaymentRecord | null>();

  if (!payment) {
    throw new PaymentServiceError("Payment was not found.", "PAYMENT_NOT_FOUND", 404);
  }

  if (payment.status === "PAID") {
    throw new PaymentServiceError(
      "This payment is already paid.",
      "PAYMENT_ALREADY_PAID",
      409,
    );
  }

  const proof = await PaymentProofModel.create({
    ...input,
    hostelId: resident.hostelId,
    paymentId: payment._id,
    residentId: resident._id,
    status: "PENDING",
    submittedBy: principal.userId,
  });
  const updatedPayment = await PaymentModel.findOneAndUpdate(
    { _id: payment._id },
    { $set: { status: "PENDING_PROOF", updatedBy: principal.userId } },
    { new: true },
  ).lean<PaymentRecord | null>();

  await auditPaymentAction(
    principal,
    resident.hostelId,
    proof._id,
    "PaymentProof",
    "PAYMENT_PROOF_SUBMITTED",
    { paymentId: payment._id.toString() },
  );

  return {
    payment: updatedPayment
      ? serializePayment(updatedPayment)
      : serializePayment(payment),
    proof: serializePaymentProof(proof as PaymentProofRecord),
    resident: serializeResidentSummary(resident),
  };
}

export async function approvePaymentProof(
  proofId: string,
  input: PaymentProofReviewInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const proof = await findAdminPaymentProof(proofId, principal, input.hostelId);
  const now = new Date();
  const payment = await PaymentModel.findOne({
    _id: proof.paymentId,
    hostelId: proof.hostelId,
    residentId: proof.residentId,
  }).lean<PaymentRecord | null>();

  if (!payment) {
    throw new PaymentServiceError("Payment was not found.", "PAYMENT_NOT_FOUND", 404);
  }

  const paidPayment = await PaymentModel.findOneAndUpdate(
    { _id: payment._id },
    {
      $set: {
        paidAmount: payment.dueAmount,
        paidDate: now,
        status: "PAID",
        updatedBy: principal.userId,
      },
    },
    { new: true },
  ).lean<PaymentRecord | null>();

  if (!paidPayment) {
    throw new PaymentServiceError("Payment was not found.", "PAYMENT_NOT_FOUND", 404);
  }

  const reviewedProof = await PaymentProofModel.findOneAndUpdate(
    { _id: proof._id },
    {
      $set: {
        reviewedAt: now,
        reviewedBy: principal.userId,
        status: "APPROVED",
      },
      $unset: { rejectionReason: "" },
    },
    { new: true },
  ).lean<PaymentProofRecord | null>();

  if (!reviewedProof) {
    throw new PaymentServiceError(
      "Payment proof was not found.",
      "PAYMENT_PROOF_NOT_FOUND",
      404,
    );
  }

  const receipt = await generateReceipt(paidPayment, principal);

  await auditPaymentAction(
    principal,
    proof.hostelId,
    proof._id,
    "PaymentProof",
    "PAYMENT_PROOF_APPROVED",
    { paymentId: proof.paymentId.toString() },
  );

  return {
    payment: serializePayment(paidPayment),
    proof: serializePaymentProof(reviewedProof),
    receipt: serializeReceipt(receipt),
  };
}

export async function rejectPaymentProof(
  proofId: string,
  input: PaymentProofReviewInput,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  if (!input.rejectionReason) {
    throw new PaymentServiceError(
      "A rejection reason is required.",
      "REJECTION_REASON_REQUIRED",
      422,
    );
  }

  const proof = await findAdminPaymentProof(proofId, principal, input.hostelId);
  const now = new Date();
  const payment = await PaymentModel.findOne({
    _id: proof.paymentId,
    hostelId: proof.hostelId,
  }).lean<PaymentRecord | null>();

  if (!payment) {
    throw new PaymentServiceError("Payment was not found.", "PAYMENT_NOT_FOUND", 404);
  }

  const nextStatus: PaymentStatus = payment.paidAmount > 0 ? "PARTIAL" : "UNPAID";
  const [reviewedProof, updatedPayment] = await Promise.all([
    PaymentProofModel.findOneAndUpdate(
      { _id: proof._id },
      {
        $set: {
          rejectionReason: input.rejectionReason,
          reviewedAt: now,
          reviewedBy: principal.userId,
          status: "REJECTED",
        },
      },
      { new: true },
    ).lean<PaymentProofRecord | null>(),
    PaymentModel.findOneAndUpdate(
      { _id: payment._id },
      { $set: { status: nextStatus, updatedBy: principal.userId } },
      { new: true },
    ).lean<PaymentRecord | null>(),
  ]);

  if (!reviewedProof || !updatedPayment) {
    throw new PaymentServiceError(
      "Payment proof was not found.",
      "PAYMENT_PROOF_NOT_FOUND",
      404,
    );
  }

  await auditPaymentAction(
    principal,
    proof.hostelId,
    proof._id,
    "PaymentProof",
    "PAYMENT_PROOF_REJECTED",
    { paymentId: proof.paymentId.toString(), reason: input.rejectionReason },
  );

  return {
    payment: serializePayment(updatedPayment),
    proof: serializePaymentProof(reviewedProof),
  };
}

export async function getResidentReceipt(receiptId: string, principal: ApiPrincipal) {
  await connectToDatabase();

  const resident = await findCurrentResident(principal);
  const receipt = await ReceiptModel.findOne({
    _id: normalizeObjectId(receiptId, "receipt id"),
    hostelId: resident.hostelId,
    residentId: resident._id,
  }).lean<ReceiptRecord | null>();

  if (!receipt) {
    throw new PaymentServiceError("Receipt was not found.", "RECEIPT_NOT_FOUND", 404);
  }

  return {
    receipt: serializeReceipt(receipt),
    resident: serializeResidentSummary(resident),
  };
}
