import nextEnv from "@next/env";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(dirname, "../../..");
const { loadEnvConfig } = nextEnv;

loadEnvConfig(repoRoot);

const DEFAULT_DEV_PASSWORD = "admin";
const isProduction = process.env.NODE_ENV === "production";
const email = (
  process.env.SEED_SUPERADMIN_EMAIL ??
  process.env.SEED_PLATFORM_OWNER_EMAIL ??
  "superadmin@gmail.com"
)
  .trim()
  .toLowerCase();
const phone = process.env.SEED_PLATFORM_OWNER_PHONE?.trim();
const name = (process.env.SEED_PLATFORM_OWNER_NAME ?? "Super Admin").trim();
const password =
  process.env.SEED_SUPERADMIN_PASSWORD ??
  process.env.SEED_PLATFORM_OWNER_PASSWORD ??
  DEFAULT_DEV_PASSWORD;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required to seed the platform owner.");
}

if (!email) {
  throw new Error("SEED_SUPERADMIN_EMAIL is required.");
}

if (!password) {
  throw new Error("SEED_SUPERADMIN_PASSWORD is required.");
}

if (isProduction && password === DEFAULT_DEV_PASSWORD) {
  console.warn("Seeding production with the locked demo super-admin password.");
}

const userSchema = new mongoose.Schema(
  {
    createdBy: { ref: "User", type: mongoose.Schema.Types.ObjectId },
    deletedAt: Date,
    deletedBy: { ref: "User", type: mongoose.Schema.Types.ObjectId },
    email: { lowercase: true, trim: true, type: String },
    hostelIds: [{ ref: "Hostel", type: mongoose.Schema.Types.ObjectId }],
    isDeleted: { default: false, type: Boolean },
    lastLoginAt: Date,
    name: { required: true, trim: true, type: String },
    passwordHash: { required: true, select: false, type: String },
    phone: { trim: true, type: String },
    role: { required: true, type: String },
    status: {
      default: "ACTIVE",
      enum: ["ACTIVE", "INVITED", "SUSPENDED", "ARCHIVED"],
      type: String,
    },
    updatedBy: { ref: "User", type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 }, { sparse: true, unique: true });
userSchema.index({ phone: 1 }, { sparse: true, unique: true });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ hostelIds: 1, status: 1 });

const User = mongoose.models.User ?? mongoose.model("User", userSchema);
const passwordHash = await bcrypt.hash(password, 12);
const update = {
  $set: {
    email,
    isDeleted: false,
    name,
    passwordHash,
    role: "SUPERADMIN",
    status: "ACTIVE",
  },
  $setOnInsert: {
    hostelIds: [],
  },
};

if (phone) {
  update.$set.phone = phone;
} else {
  update.$unset = { phone: "" };
}

await mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false,
});

const user = await User.findOneAndUpdate({ email }, update, {
  returnDocument: "after",
  setDefaultsOnInsert: true,
  upsert: true,
});

await mongoose.disconnect();

console.log("Platform owner seed ready:");
console.log(`  email: ${user.email}`);
console.log(`  role: ${user.role}`);
console.log(`  password: ${password}`);
