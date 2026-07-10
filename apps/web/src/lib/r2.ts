import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client: S3Client | null = null;

export function getR2Client() {
  if (!client) {
    const endpoint = process.env.R2_ENDPOINT;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!endpoint || !accessKeyId || !secretAccessKey) {
      throw new Error(
        "R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY must be set",
      );
    }

    client = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
      requestHandler: { requestTimeout: 30_000 },
    });
  }
  return client;
}

export function generateFileKey(prefix: string, fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  const uniqueId = crypto.randomUUID();
  return `${prefix}/${uniqueId}.${ext}`;
}

export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  maxSizeBytes?: number,
) {
  const bucket = process.env.R2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("R2_BUCKET_NAME must be set");
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
    ...(maxSizeBytes ? { ContentLength: maxSizeBytes } : {}),
  });
  return getSignedUrl(getR2Client(), command, { expiresIn: 600 });
}

export async function getPresignedReadUrl(key: string) {
  const bucket = process.env.R2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("R2_BUCKET_NAME must be set");
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(getR2Client(), command, { expiresIn: 3600 });
}
