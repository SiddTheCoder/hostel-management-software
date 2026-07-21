/**
 * One-shot data migration: maps legacy role values (pre-docs codebase) to
 * the canonical DATABASE.md roles.
 *
 *   PLATFORM_OWNER  -> SUPERADMIN
 *   HOSTEL_OWNER    -> HOSTEL_ADMIN
 *   PUBLIC_USER     -> PUBLIC
 *   SERVICE_PROVIDER-> PUBLIC   (providers are a directory, not an auth role)
 *
 * Usage: node --experimental-transform-types packages/db/src/migrate-roles.ts
 * Requires MONGODB_URI in the environment (load the repo-root .env first).
 * Safe to run repeatedly — it only touches documents with legacy values.
 */
import { connectToDatabase, disconnectFromDatabase } from "./connection";
import { UserModel } from "./models/User";
import { LEGACY_ROLE_MAP } from "@hostel/shared/types/roles";

async function main() {
  await connectToDatabase();

  for (const [legacyRole, newRole] of Object.entries(LEGACY_ROLE_MAP)) {
    const result = await UserModel.updateMany(
      { role: legacyRole },
      { $set: { role: newRole } },
    );

    if (result.modifiedCount > 0) {
      console.log(`${legacyRole} -> ${newRole}: ${result.modifiedCount} user(s) migrated`);
    }
  }

  console.log("Role migration complete.");
  await disconnectFromDatabase();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
