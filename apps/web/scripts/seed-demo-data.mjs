import nextEnv from "@next/env";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(dirname, "../../..");
const { loadEnvConfig } = nextEnv;

loadEnvConfig(repoRoot);

const DEFAULT_DEV_PASSWORD = "ChangeMe123!";
const demoPassword = process.env.DEMO_SEED_PASSWORD ?? DEFAULT_DEV_PASSWORD;
const isProduction = process.env.NODE_ENV === "production";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required to seed demo data.");
}

if (demoPassword.length < 8) {
  throw new Error("DEMO_SEED_PASSWORD must be at least 8 characters.");
}

if (isProduction && demoPassword === DEFAULT_DEV_PASSWORD) {
  throw new Error("Refusing to seed production with the default development password.");
}

const looseSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const User = mongoose.models.User ?? mongoose.model("User", looseSchema);
const Hostel = mongoose.models.Hostel ?? mongoose.model("Hostel", looseSchema);
const HostelMember =
  mongoose.models.HostelMember ?? mongoose.model("HostelMember", looseSchema);
const Floor = mongoose.models.Floor ?? mongoose.model("Floor", looseSchema);
const Room = mongoose.models.Room ?? mongoose.model("Room", looseSchema);
const Bed = mongoose.models.Bed ?? mongoose.model("Bed", looseSchema);
const Resident = mongoose.models.Resident ?? mongoose.model("Resident", looseSchema);
const Guardian = mongoose.models.Guardian ?? mongoose.model("Guardian", looseSchema);
const EmergencyContact =
  mongoose.models.EmergencyContact ?? mongoose.model("EmergencyContact", looseSchema);
const ServiceProvider =
  mongoose.models.ServiceProvider ?? mongoose.model("ServiceProvider", looseSchema);
const Inquiry = mongoose.models.Inquiry ?? mongoose.model("Inquiry", looseSchema);
const FoodMenu = mongoose.models.FoodMenu ?? mongoose.model("FoodMenu", looseSchema);
const Notice = mongoose.models.Notice ?? mongoose.model("Notice", looseSchema);
const Payment = mongoose.models.Payment ?? mongoose.model("Payment", looseSchema);

const passwordHash = await bcrypt.hash(demoPassword, 12);
const now = new Date();
const moveInDate = new Date("2026-06-01T00:00:00.000Z");

async function upsertUser({ email, name, phone, role, status = "ACTIVE" }) {
  return User.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        isDeleted: false,
        name,
        passwordHash,
        phone,
        role,
        status,
      },
    },
    { returnDocument: "after", setDefaultsOnInsert: true, upsert: true },
  );
}

await mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false,
});

const platformOwner = await upsertUser({
  email: process.env.SEED_PLATFORM_OWNER_EMAIL ?? "platform.owner@hostelhub.local",
  name: process.env.SEED_PLATFORM_OWNER_NAME ?? "Platform Owner",
  phone: process.env.SEED_PLATFORM_OWNER_PHONE || "9800000000",
  role: "PLATFORM_OWNER",
});

const hostelAdmin = await upsertUser({
  email: "hostel.admin@hostelhub.local",
  name: "Demo Hostel Admin",
  phone: "9800000001",
  role: "HOSTEL_ADMIN",
});

const residentUser = await upsertUser({
  email: "resident@hostelhub.local",
  name: "Demo Resident",
  phone: "9800000002",
  role: "RESIDENT",
});

const guardianUser = await upsertUser({
  email: "guardian@hostelhub.local",
  name: "Demo Guardian",
  phone: "9800000003",
  role: "GUARDIAN",
});

const hostel = await Hostel.findOneAndUpdate(
  { slug: "demo-kathmandu-hostel" },
  {
    $set: {
      capacitySummary: { totalBeds: 2, totalRooms: 1, vacantBeds: 1 },
      contact: { email: "demo-hostel@hostelhub.local", phone: "9800001000" },
      createdBy: platformOwner._id,
      description: "Demo hostel seeded for local QA and pilot walkthroughs.",
      facilities: ["Wi-Fi", "Laundry", "Study room", "Hot water"],
      food: { hasNonVeg: true, hasVeg: true, mealsPerDay: 3, notes: "Dal bhat daily" },
      hostelType: "CO_LIVING",
      isDeleted: false,
      location: {
        address: "Demo Marg, New Baneshwor",
        area: "New Baneshwor",
        city: "Kathmandu",
        province: "Bagmati",
      },
      name: "Demo Kathmandu Hostel",
      ownerId: hostelAdmin._id,
      photos: [
        {
          alt: "Demo hostel exterior",
          url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
        },
      ],
      pricing: {
        admissionFee: 5000,
        currency: "NPR",
        monthlyRentMax: 18000,
        monthlyRentMin: 14000,
      },
      roomTypes: ["Shared", "Private"],
      rules: ["Quiet hours after 10 PM", "Visitor entry requires warden approval"],
      slug: "demo-kathmandu-hostel",
      status: "PUBLISHED",
      updatedBy: platformOwner._id,
      verificationStatus: "VERIFIED",
    },
  },
  { returnDocument: "after", setDefaultsOnInsert: true, upsert: true },
);

await HostelMember.findOneAndUpdate(
  { hostelId: hostel._id, userId: hostelAdmin._id },
  {
    $set: {
      createdBy: platformOwner._id,
      hostelId: hostel._id,
      isDeleted: false,
      role: "HOSTEL_ADMIN",
      status: "ACTIVE",
      updatedBy: platformOwner._id,
      userId: hostelAdmin._id,
    },
  },
  { upsert: true },
);

const floor = await Floor.findOneAndUpdate(
  { hostelId: hostel._id, level: 1 },
  {
    $set: {
      createdBy: hostelAdmin._id,
      description: "Main resident floor",
      hostelId: hostel._id,
      isDeleted: false,
      level: 1,
      name: "First Floor",
      sortOrder: 1,
      status: "ACTIVE",
      updatedBy: hostelAdmin._id,
    },
  },
  { returnDocument: "after", setDefaultsOnInsert: true, upsert: true },
);

const room = await Room.findOneAndUpdate(
  { hostelId: hostel._id, roomNumber: "101" },
  {
    $set: {
      capacity: 2,
      createdBy: hostelAdmin._id,
      facilities: ["Window", "Table", "Cupboard"],
      floorId: floor._id,
      hostelId: hostel._id,
      isDeleted: false,
      repairStatus: "OK",
      roomNumber: "101",
      roomType: "Shared",
      status: "ACTIVE",
      updatedBy: hostelAdmin._id,
      vacancyStatus: "PARTIAL",
    },
  },
  { returnDocument: "after", setDefaultsOnInsert: true, upsert: true },
);

const bed = await Bed.findOneAndUpdate(
  { hostelId: hostel._id, roomId: room._id, bedNumber: "101-A" },
  {
    $set: {
      bedNumber: "101-A",
      createdBy: hostelAdmin._id,
      floorId: floor._id,
      hostelId: hostel._id,
      isDeleted: false,
      repairStatus: "OK",
      roomId: room._id,
      status: "OCCUPIED",
      updatedBy: hostelAdmin._id,
    },
  },
  { returnDocument: "after", setDefaultsOnInsert: true, upsert: true },
);

const resident = await Resident.findOneAndUpdate(
  { hostelId: hostel._id, phone: "9800000002" },
  {
    $set: {
      bedId: bed._id,
      createdBy: hostelAdmin._id,
      depositAmount: 10000,
      email: "resident@hostelhub.local",
      firstName: "Demo",
      hostelId: hostel._id,
      isDeleted: false,
      lastName: "Resident",
      moveInDate,
      phone: "9800000002",
      roomId: room._id,
      status: "ACTIVE",
      updatedBy: hostelAdmin._id,
      userId: residentUser._id,
    },
  },
  { returnDocument: "after", setDefaultsOnInsert: true, upsert: true },
);

await Bed.updateOne(
  { _id: bed._id },
  { $set: { assignedResidentId: resident._id, status: "OCCUPIED" } },
);

await Guardian.findOneAndUpdate(
  { residentId: resident._id, phone: "9800000003" },
  {
    $set: {
      email: "guardian@hostelhub.local",
      firstName: "Demo",
      isPrimary: true,
      lastName: "Guardian",
      phone: "9800000003",
      relation: "Parent",
      residentId: resident._id,
      userId: guardianUser._id,
    },
  },
  { upsert: true },
);

await EmergencyContact.findOneAndUpdate(
  { residentId: resident._id, phone: "9800009999" },
  {
    $set: {
      isPrimary: true,
      name: "Demo Emergency Contact",
      phone: "9800009999",
      relation: "Local guardian",
      residentId: resident._id,
    },
  },
  { upsert: true },
);

await ServiceProvider.findOneAndUpdate(
  { phone: "9800004000" },
  {
    $set: {
      area: "New Baneshwor",
      availability: "Daily 8 AM - 6 PM",
      category: "ELECTRICIAN",
      city: "Kathmandu",
      createdBy: platformOwner._id,
      description: "Demo approved electrician for maintenance request testing.",
      experience: "5 years",
      fullName: "Demo Electric Works",
      isDeleted: false,
      phone: "9800004000",
      ratingSummary: { averageRating: 4.5, totalReviews: 8 },
      status: "APPROVED",
      updatedBy: platformOwner._id,
    },
  },
  { upsert: true },
);

await Inquiry.findOneAndUpdate(
  { hostelId: hostel._id, phone: "9800005000" },
  {
    $set: {
      areaPreference: "New Baneshwor",
      hostelId: hostel._id,
      message: "Demo inquiry for hostel-admin follow-up.",
      name: "Prospective Student",
      phone: "9800005000",
      source: "PUBLIC_WEBSITE",
      status: "NEW",
    },
  },
  { upsert: true },
);

await Payment.findOneAndUpdate(
  { hostelId: hostel._id, residentId: resident._id, month: "2026-06" },
  {
    $set: {
      createdBy: hostelAdmin._id,
      dueAmount: 14000,
      dueDate: new Date("2026-06-10T00:00:00.000Z"),
      hostelId: hostel._id,
      month: "2026-06",
      paidAmount: 0,
      residentId: resident._id,
      status: "UNPAID",
      updatedBy: hostelAdmin._id,
    },
  },
  { upsert: true },
);

await FoodMenu.findOneAndUpdate(
  {
    hostelId: hostel._id,
    date: new Date("2026-06-27T00:00:00.000Z"),
    mealType: "DINNER",
  },
  {
    $set: {
      createdBy: hostelAdmin._id,
      date: new Date("2026-06-27T00:00:00.000Z"),
      dayOfWeek: "SATURDAY",
      hostelId: hostel._id,
      items: ["Dal", "Rice", "Mixed curry", "Achar"],
      mealType: "DINNER",
      timing: "7:30 PM - 9:00 PM",
      updatedBy: hostelAdmin._id,
      weekStartDate: new Date("2026-06-21T00:00:00.000Z"),
    },
  },
  { upsert: true },
);

await Notice.findOneAndUpdate(
  { hostelId: hostel._id, title: "Demo Notice" },
  {
    $set: {
      category: "GENERAL",
      content: "This seeded notice confirms the resident notice feed is connected.",
      createdBy: hostelAdmin._id,
      hostelId: hostel._id,
      isUrgent: false,
      publishedAt: now,
      title: "Demo Notice",
      updatedBy: hostelAdmin._id,
    },
  },
  { upsert: true },
);

await mongoose.disconnect();

console.log("Demo seed ready:");
console.log("  platform owner: platform.owner@hostelhub.local");
console.log("  hostel admin: hostel.admin@hostelhub.local");
console.log("  resident: resident@hostelhub.local");
console.log("  guardian: guardian@hostelhub.local");
console.log("  password: value from DEMO_SEED_PASSWORD");
