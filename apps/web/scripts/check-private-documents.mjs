import nextEnv from "@next/env";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(dirname, "../../..");
const { loadEnvConfig } = nextEnv;

loadEnvConfig(repoRoot);

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required for private document checks.");
}

const strictMissing = process.env.PRIVATE_DOCUMENT_CHECK_STRICT_MISSING === "true";
const objectIdPattern = /^[a-f\d]{24}$/i;

const privateReferences = [
  { collection: "hosteldocuments", field: "fileAssetId", label: "hostel document" },
  { collection: "residentdocuments", field: "fileAssetId", label: "resident document" },
  {
    collection: "serviceproviderdocuments",
    field: "fileAssetId",
    label: "service provider document",
  },
  { collection: "paymentproofs", field: "proofImageAssetId", label: "payment proof" },
  {
    collection: "complaintattachments",
    field: "fileAssetId",
    label: "complaint attachment",
  },
  {
    collection: "roomconditionphotos",
    field: "fileAssetId",
    label: "room condition photo",
  },
];

await mongoose.connect(process.env.MONGODB_URI, {
  bufferCommands: false,
});

const db = mongoose.connection.db;
const violations = [];
const warnings = [];

async function findFileAsset(reference) {
  if (!reference) {
    return null;
  }

  if (typeof reference === "string" && objectIdPattern.test(reference)) {
    return db
      .collection("fileassets")
      .findOne({ _id: new mongoose.Types.ObjectId(reference) });
  }

  if (reference instanceof mongoose.Types.ObjectId) {
    return db.collection("fileassets").findOne({ _id: reference });
  }

  if (typeof reference === "string") {
    return db.collection("fileassets").findOne({ key: reference });
  }

  return null;
}

for (const source of privateReferences) {
  const cursor = db.collection(source.collection).find({
    [source.field]: { $exists: true, $ne: null },
    isDeleted: { $ne: true },
  });

  for await (const record of cursor) {
    const reference = record[source.field];
    const asset = await findFileAsset(reference);
    const context = `${source.label} ${record._id.toString()}`;

    if (!asset) {
      const message = `${context} references missing file asset ${String(reference)}.`;
      if (strictMissing) {
        violations.push(message);
      } else {
        warnings.push(message);
      }
      continue;
    }

    if (asset.accessLevel === "PUBLIC") {
      violations.push(`${context} points to PUBLIC file asset ${asset._id.toString()}.`);
    }

    if (asset.status !== "ACTIVE" || asset.isDeleted === true) {
      violations.push(
        `${context} points to inactive/deleted file asset ${asset._id.toString()}.`,
      );
    }
  }
}

await mongoose.disconnect();

for (const warning of warnings) {
  console.warn(`WARN: ${warning}`);
}

if (violations.length > 0) {
  for (const violation of violations) {
    console.error(`FAIL: ${violation}`);
  }

  throw new Error(
    `Private document check failed with ${violations.length} violation(s).`,
  );
}

console.log("Private document check passed.");
