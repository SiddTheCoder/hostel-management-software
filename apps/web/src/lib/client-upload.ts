import { browserApi } from "@/lib/browser-api";

type PresignResponse = {
  assetId: string;
  key: string;
  presignedUrl: string;
};

type OptimizeResponse = {
  assetId: string;
  variants: Array<{
    height: number;
    mimeType: string;
    sizeBytes: number;
    variant: string;
    width: number;
  }>;
};

type ReadUrlResponse = {
  mimeType: string;
  url: string;
  variant: string;
};

export async function uploadFile(
  file: File,
  accessLevel: "PUBLIC" | "PRIVATE" | "PROTECTED" = "PRIVATE",
) {
  const { assetId, presignedUrl } = await browserApi<PresignResponse>(
    "/api/v1/files/presign",
    {
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        accessLevel,
      }),
      method: "POST",
    },
  );

  const uploadResponse = await fetch(presignedUrl, {
    body: file,
    headers: { "Content-Type": file.type },
    method: "PUT",
  });

  if (!uploadResponse.ok) {
    throw new Error("File upload to storage failed.");
  }

  return assetId;
}

export async function optimizeImage(assetId: string) {
  return browserApi<OptimizeResponse>(
    `/api/v1/files/${assetId}/optimize`,
    { method: "POST" },
  );
}

export async function getImageUrl(assetId: string, variant = "THUMBNAIL") {
  return browserApi<ReadUrlResponse>(
    `/api/v1/files/${assetId}/url?variant=${variant}`,
  );
}
