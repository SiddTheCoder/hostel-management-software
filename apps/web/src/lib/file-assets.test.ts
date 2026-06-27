import { afterEach, describe, expect, it } from "vitest";

import { validateFileAssetMetadata } from "@/lib/file-assets";

describe("file asset metadata validation", () => {
  afterEach(() => {
    delete process.env.UPLOAD_MAX_IMAGE_BYTES;
    delete process.env.UPLOAD_MAX_DOCUMENT_BYTES;
    delete process.env.ALLOWED_IMAGE_MIME_TYPES;
    delete process.env.ALLOWED_DOCUMENT_MIME_TYPES;
  });

  it("accepts allowed image and document MIME types within size limits", () => {
    process.env.UPLOAD_MAX_IMAGE_BYTES = "1000";
    process.env.UPLOAD_MAX_DOCUMENT_BYTES = "2000";

    expect(
      validateFileAssetMetadata({ mimeType: "image/png", sizeBytes: 999 }),
    ).toBeNull();
    expect(
      validateFileAssetMetadata({ mimeType: "application/pdf", sizeBytes: 1999 }),
    ).toBeNull();
  });

  it("rejects oversize images, oversize documents, and unknown MIME types", () => {
    process.env.UPLOAD_MAX_IMAGE_BYTES = "1000";
    process.env.UPLOAD_MAX_DOCUMENT_BYTES = "2000";

    expect(
      validateFileAssetMetadata({ mimeType: "image/jpeg", sizeBytes: 1001 }),
    ).toContain("Image exceeds");
    expect(
      validateFileAssetMetadata({ mimeType: "application/pdf", sizeBytes: 2001 }),
    ).toContain("Document exceeds");
    expect(validateFileAssetMetadata({ mimeType: "text/html", sizeBytes: 100 })).toBe(
      "File MIME type is not allowed.",
    );
  });
});
