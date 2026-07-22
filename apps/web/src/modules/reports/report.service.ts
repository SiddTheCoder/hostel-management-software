import { Types, type PipelineStage } from "mongoose";
import type { z } from "zod";

import type { ApiPrincipal } from "@/lib/api-auth";
import { connectToDatabase } from "@/lib/db";
import { assertHostelAccess } from "@/lib/tenant";
import { BedModel } from "@hostel/db/models/Bed";
import { ComplaintModel } from "@hostel/db/models/Complaint";
import { FoodFeedbackModel } from "@hostel/db/models/FoodFeedback";
import { HostelModel } from "@hostel/db/models/Hostel";
import { InquiryModel } from "@hostel/db/models/Inquiry";
import { ListingFlagModel } from "@hostel/db/models/ListingFlag";
import { MaintenanceRequestModel } from "@hostel/db/models/MaintenanceRequest";
import { NightStatusModel } from "@hostel/db/models/NightStatus";
import { PaymentModel } from "@hostel/db/models/Payment";
import { PaymentProofModel } from "@hostel/db/models/PaymentProof";
import { RatingReviewModel } from "@hostel/db/models/RatingReview";
import { ResidentModel } from "@hostel/db/models/Resident";
import { ServiceProviderModel } from "@hostel/db/models/ServiceProvider";
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

type PlatformPaymentRecord = {
  _id: Types.ObjectId;
  dueAmount: number;
  dueDate?: Date;
  hostelId: Types.ObjectId;
  month: string;
  paidAmount: number;
  status: string;
};

// Read-only, platform-wide roll-up of resident payment records (no hostel
// scoping) for the Platform Owner "Payments" tab. Manual/gateway billing stays
// out of scope; this simply aggregates what admins have already recorded.
export async function getPlatformPaymentsOverview() {
  await connectToDatabase();

  const [totals, statusCounts, pendingProofs, recent] = await Promise.all([
    sumPayments({}),
    countByField(PaymentModel, {}, "status"),
    PaymentProofModel.countDocuments({ status: "PENDING" }),
    PaymentModel.find({})
      .sort({ createdAt: -1 })
      .limit(25)
      .lean<PlatformPaymentRecord[]>(),
  ]);

  const hostelIds = [...new Set(recent.map((payment) => payment.hostelId.toString()))];
  const hostels = await HostelModel.find({ _id: { $in: hostelIds } })
    .select("name")
    .lean<Array<{ _id: Types.ObjectId; name?: string }>>();
  const nameById = new Map(hostels.map((hostel) => [hostel._id.toString(), hostel.name ?? "—"]));

  return {
    overview: {
      outstanding: Math.max(totals.dueAmount - totals.paidAmount, 0),
      pendingProofs,
      statusCounts,
      totalDue: totals.dueAmount,
      totalPaid: totals.paidAmount,
    },
    recent: recent.map((payment) => ({
      dueAmount: payment.dueAmount,
      dueDate: payment.dueDate?.toISOString() ?? null,
      hostelName: nameById.get(payment.hostelId.toString()) ?? "—",
      id: payment._id.toString(),
      month: payment.month,
      paidAmount: payment.paidAmount,
      status: payment.status,
    })),
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
