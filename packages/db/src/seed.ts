/**
 * Seeds the initial SUPERADMIN account (PHASES.md Phase 1 / ENVIRONMENT.md).
 *
 * Usage: npm run db:seed   (root script; requires MONGODB_URI and
 * SEED_SUPERADMIN_EMAIL / SEED_SUPERADMIN_PASSWORD in the repo-root .env)
 *
 * SUPERADMIN accounts are only ever created here — never via an API
 * endpoint (RULES.md §4).
 */
import bcrypt from "bcryptjs";

import { connectToDatabase, disconnectFromDatabase } from "./connection";
import { UserModel } from "./models/User";
import { Role } from "@hostel/shared/types/roles";
import { AuthProvider } from "@hostel/shared/types/enums";

const DEFAULT_DEV_PASSWORD = "admin";

async function main() {
  const email = (
    process.env.SEED_SUPERADMIN_EMAIL ??
    process.env.SEED_PLATFORM_OWNER_EMAIL ??
    ""
  )
    .trim()
    .toLowerCase();
  const name = (
    process.env.SEED_SUPERADMIN_NAME ??
    process.env.SEED_PLATFORM_OWNER_NAME ??
    "Super Admin"
  ).trim();
  const password =
    process.env.SEED_SUPERADMIN_PASSWORD ??
    process.env.SEED_PLATFORM_OWNER_PASSWORD ??
    (process.env.NODE_ENV === "production" ? "" : DEFAULT_DEV_PASSWORD);

  if (!email) {
    throw new Error("SEED_SUPERADMIN_EMAIL is required.");
  }

  if (!password) {
    throw new Error("SEED_SUPERADMIN_PASSWORD is required.");
  }

  if (process.env.NODE_ENV === "production" && password === DEFAULT_DEV_PASSWORD) {
    throw new Error("Refusing to seed production with the default dev password.");
  }

  await connectToDatabase();

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        name,
        passwordHash,
        role: Role.SUPERADMIN,
        authProvider: AuthProvider.LOCAL,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        status: "ACTIVE",
        isDeleted: false,
      },
      $setOnInsert: {
        hostelIds: [],
        mustChangePassword: false,
        tokenVersion: 0,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  console.log("SUPERADMIN seed complete:");
  console.log(`  email: ${user.email}`);
  console.log(`  role:  ${user.role}`);

  await disconnectFromDatabase();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
