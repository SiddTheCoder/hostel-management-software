import { z } from "zod";

export const deviceTokenSaveSchema = z.object({
  deviceId: z.string().trim().max(160).optional(),
  platform: z.enum(["IOS", "ANDROID", "WEB"]),
  token: z.string().trim().min(8).max(4096),
});
