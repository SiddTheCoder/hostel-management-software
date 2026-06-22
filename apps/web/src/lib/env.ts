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
  OTP_TTL_MINUTES: z.string().default("10"),
  OTP_RESEND_COOLDOWN_SECONDS: z.string().default("60"),
  OTP_RATE_LIMIT_WINDOW_MINUTES: z.string().default("15"),
  OTP_RATE_LIMIT_MAX: z.string().default("5"),
  OTP_HASH_SECRET: z.string().optional(),
  EMAIL_OTP_PROVIDER: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  SMS_OTP_PROVIDER: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_PHONE: z.string().optional(),
  TWILIO_MESSAGING_SERVICE_SID: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((value) => value === "true"),
  LOG_LEVEL: z.string().default("info"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function validateServerEnv() {
  return serverEnvSchema.parse(process.env);
}
