import { z } from "zod";

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  MONGODB_URI: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL: z.string().default("30d"),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  OBJECT_STORAGE_PROVIDER: z.string().optional(),
  OBJECT_STORAGE_BUCKET: z.string().optional(),
  OBJECT_STORAGE_REGION: z.string().optional(),
  OBJECT_STORAGE_ACCESS_KEY_ID: z.string().optional(),
  OBJECT_STORAGE_SECRET_ACCESS_KEY: z.string().optional(),
  OBJECT_STORAGE_PUBLIC_BASE_URL: z.string().optional(),
  FCM_PROJECT_ID: z.string().optional(),
  FCM_CLIENT_EMAIL: z.string().optional(),
  FCM_PRIVATE_KEY: z.string().optional(),
  MAPS_PROVIDER: z.string().optional(),
  MAPS_API_KEY: z.string().optional(),
  RATE_LIMIT_REDIS_URL: z.string().optional(),
  LOG_LEVEL: z.string().default("info"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function validateServerEnv() {
  return serverEnvSchema.parse(process.env);
}
