import { Types, type PipelineStage } from "mongoose";
import type { z } from "zod";

import type { ApiPrincipal } from "@/lib/api-auth";
import { connectToDatabase } from "@/lib/db";
import { assertHostelAccess } from "@/lib/tenant";
import { BedModel } from "@/models/Bed";
import { ComplaintModel } from "@/models/Complaint";
import { FoodFeedbackModel } from "@/models/FoodFeedback";
import { HostelModel } from "@/models/Hostel";
import { InquiryModel } from "@/models/Inquiry";
import { ListingFlagModel } from "@/models/ListingFlag";
import { MaintenanceRequestModel } from "@/models/MaintenanceRequest";
import { NightStatusModel } from "@/models/NightStatus";
import { PaymentModel } from "@/models/Payment";
import { PaymentProofModel } from "@/models/PaymentProof";
import { RatingReviewModel } from "@/models/RatingReview";
import { ResidentModel } from "@/models/Resident";
import { ServiceProviderModel } from "@/models/ServiceProvider";
import type { reportQuerySchema } from "@/modules/reports/report.validation";

type ReportQuery = z.infer<typeof reportQuerySchema>;

export class ReportServiceError extends Error {
  constructor(
    message: string,
    public errorCode = "REPORT_ERROR",
    public status = 400,
  ) {
    super(message);
  }
}

function normalizeObjectId(value: string, label = "id") {
  if (!Types.ObjectId.isValid(value)) {
    throw new ReportServiceError(`Invalid ${label}.`, "INVALID_OBJECT_ID", 422);
  }

  return new Types.ObjectId(value);
}

function normalizeObjectIds(values: string[]) {
  return values.map((value) => normalizeObjectId(value, "hostel id"));
}

function hostelFilter(principal: ApiPrincipal, requestedHostelId?: string) {
  if (requestedHostelId) {
    assertHostelAccess(principal, requestedHostelId);
    return { hostelId: normalizeObjectId(requestedHostelId, "hostel id") };
  }

  return {
    hostelId: {
      $in: normalizeObjectIds(principal.hostelIds),
    },
  };
}

function startOfMonth(month?: string) {
  if (!month) {
    return null;
  }

  const [year, index] = month.split("-").map(Number);

  if (!year || !index) {
    return null;
  }

  return new Date(Date.UTC(year, index - 1, 1));
}

function endOfMonth(month?: string) {
  const start = startOfMonth(month);

  if (!start) {
    return null;
  }

  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
}

async function sumPayments(filter: Record<string, unknown>) {
  const [result] = await PaymentModel.aggregate<{
    dueAmount: number;
    paidAmount: number;
  }>([
    { $match: filter },
    {
      $group: {
        _id: null,
        dueAmount: { $sum: "$dueAmount" },
        paidAmount: { $sum: "$paidAmount" },
      },
    },
  ]);

  return {
    dueAmount: result?.dueAmount ?? 0,
    paidAmount: result?.paidAmount ?? 0,
  };
}

async function countByField(
  model: {
    aggregate: <T>(pipeline: PipelineStage[]) => {
      exec: () => Promise<T[]>;
    };
  },
  filter: Record<string, unknown>,
  field: string,
) {
  const rows = await model
    .aggregate<{
      _id: string;
      count: number;
    }>([
      { $match: filter },
      { $group: { _id: `$${field}`, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    .exec();

  return Object.fromEntries(rows.map((row) => [row._id ?? "UNKNOWN", row.count]));
}

export async function getPlatformDashboardReport() {
  await connectToDatabase();

  const [
    totalHostels,
    pendingApprovals,
    activeResidents,
    inquiries,
    serviceProviders,
    complaints,
    reviews,
    openListingFlags,
  ] = await Promise.all([
    HostelModel.countDocuments({ isDeleted: false }),
    HostelModel.countDocuments({ isDeleted: false, status: "PENDING_APPROVAL" }),
    ResidentModel.countDocuments({ isDeleted: false, status: "ACTIVE" }),
    InquiryModel.countDocuments({ isDeleted: false }),
    ServiceProviderModel.countDocuments({ isDeleted: false }),
    ComplaintModel.countDocuments({}),
    RatingReviewModel.countDocuments({}),
    ListingFlagModel.countDocuments({ isDeleted: false, status: "OPEN" }),
  ]);

  return {
    report: {
      activeResidents,
      complaints,
      inquiries,
      openListingFlags,
      pendingApprovals,
      platformPayments: {
        note: "Subscription/payment ledger is still outside the current pilot schema.",
        total: 0,
      },
      reviews,
      serviceProviders,
      totalHostels,
    },
  };
}

export async function getHostelAdminDashboardReport(
  query: ReportQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const scoped = hostelFilter(principal, query.hostelId);
  const paymentFilter = { ...scoped };
  const [
    residents,
    vacantBeds,
    paymentTotals,
    pendingPaymentProofs,
    complaints,
    maintenanceRequests,
    foodFeedback,
    nightStatusSummary,
  ] = await Promise.all([
    ResidentModel.countDocuments({ ...scoped, isDeleted: false }),
    BedModel.countDocuments({ ...scoped, isDeleted: false, status: "AVAILABLE" }),
    sumPayments(paymentFilter),
    PaymentProofModel.countDocuments({ ...scoped, status: "PENDING" }),
    ComplaintModel.countDocuments(scoped),
    MaintenanceRequestModel.countDocuments({ ...scoped, isDeleted: false }),
    FoodFeedbackModel.countDocuments(scoped),
    countByField(NightStatusModel, scoped, "status"),
  ]);

  return {
    report: {
      complaints,
      foodFeedback,
      maintenanceRequests,
      monthlyDues: paymentTotals.dueAmount,
      paidAmount: paymentTotals.paidAmount,
      pendingPaymentProofs,
      residents,
      vacantBeds,
      nightStatusSummary,
    },
  };
}

export async function getHostelAdminPaymentsReport(
  query: ReportQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const scoped = hostelFilter(principal, query.hostelId);
  const filter: Record<string, unknown> = { ...scoped };
  const monthStart = startOfMonth(query.month);
  const monthEnd = endOfMonth(query.month);

  if (query.month) {
    filter.month = query.month;
  }

  const proofFilter: Record<string, unknown> = { ...scoped };

  if (monthStart && monthEnd) {
    proofFilter.submittedAt = { $gte: monthStart, $lt: monthEnd };
  }

  const [totals, byStatus, pendingProofs] = await Promise.all([
    sumPayments(filter),
    countByField(PaymentModel, filter, "status"),
    PaymentProofModel.countDocuments({ ...proofFilter, status: "PENDING" }),
  ]);

  return {
    report: {
      byStatus,
      pendingProofs,
      totalDue: totals.dueAmount,
      totalPaid: totals.paidAmount,
    },
  };
}

export async function getHostelAdminComplaintsReport(
  query: ReportQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const scoped = hostelFilter(principal, query.hostelId);

  const [byStatus, byCategory, total] = await Promise.all([
    countByField(ComplaintModel, scoped, "status"),
    countByField(ComplaintModel, scoped, "category"),
    ComplaintModel.countDocuments(scoped),
  ]);

  return {
    report: {
      byCategory,
      byStatus,
      total,
    },
  };
}

export async function getHostelAdminMaintenanceReport(
  query: ReportQuery,
  principal: ApiPrincipal,
) {
  await connectToDatabase();

  const scoped = {
    ...hostelFilter(principal, query.hostelId),
    isDeleted: false,
  };

  const [byStatus, byCategory, total, completed] = await Promise.all([
    countByField(MaintenanceRequestModel, scoped, "status"),
    countByField(MaintenanceRequestModel, scoped, "category"),
    MaintenanceRequestModel.countDocuments(scoped),
    MaintenanceRequestModel.countDocuments({ ...scoped, status: "COMPLETED" }),
  ]);

  return {
    report: {
      byCategory,
      byStatus,
      completed,
      open: total - completed,
      total,
    },
  };
}
