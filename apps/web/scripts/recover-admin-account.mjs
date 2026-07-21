import nextEnv from "@next/env";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(dirname, "../../..");
const { loadEnvConfig } = nextEnv;

loadEnvConfig(repoRoot);

const email = process.env.ADMIN_RECOVERY_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_RECOVERY_PASSWORD;
const confirm = process.env.ADMIN_RECOVERY_CONFIRM;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required for admin recovery.");
}

if (confirm !== "YES") {
  throw new Error("Set ADMIN_RECOVERY_CONFIRM=YES to run admin account recovery.");
}

if (!email) {
  throw new Error("ADMIN_RECOVERY_EMAIL is required.");
}

if (!password || password.length < 12) {
  throw new Error("ADMIN_RECOVERY_PASSWORD must be at least 12 characters.");
}

const looseSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const User = mongoose.models.User ?? mongoose.model("User", looseSchema);

await mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false,
});

const passwordHash = await bcrypt.hash(password, 12);
const user = await User.findOneAndUpdate(
  { email, role: "SUPERADMIN" },
  {
    $set: {
      isDeleted: false,
      passwordHash,
      status: "ACTIVE",
    },
    $unset: {
      deletedAt: "",
      deletedBy: "",
    },
  },
  { returnDocument: "after" },
);

await mongoose.disconnect();

if (!user) {
  throw new Error("No SUPERADMIN account matched ADMIN_RECOVERY_EMAIL.");
}

console.log("Platform owner recovery complete:");
console.log(`  email: ${email}`);
console.log("  password: value from ADMIN_RECOVERY_PASSWORD");
