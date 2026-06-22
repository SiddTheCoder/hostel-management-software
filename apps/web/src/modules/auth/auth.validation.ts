import { z } from "zod";

import { objectIdSchema, phoneSchema } from "@/lib/validators";

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Email or phone is required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const otpChannelSchema = z.enum(["email", "phone"]);

export const otpPurposeSchema = z.enum(["registration"]);

export const otpRequestSchema = z
  .object({
    channel: otpChannelSchema,
    identifier: z.string().trim().min(3, "Email or phone is required."),
    purpose: otpPurposeSchema.default("registration"),
  })
  .superRefine((input, context) => {
    if (input.channel === "email") {
      const result = z.string().email().safeParse(input.identifier);

      if (!result.success) {
        context.addIssue({
          code: "custom",
          message: "Expected a valid email address.",
          path: ["identifier"],
        });
      }
    }

    if (input.channel === "phone") {
      const result = phoneSchema.safeParse(input.identifier);

      if (!result.success) {
        context.addIssue({
          code: "custom",
          message: "Expected a valid phone number.",
          path: ["identifier"],
        });
      }
    }
  });

export const otpVerifySchema = z.object({
  challengeId: objectIdSchema,
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Expected a 6-digit OTP code."),
});

export const registerSchema = z
  .object({
    email: z.string().trim().email().optional(),
    name: z.string().trim().min(2, "Name is required.").max(120),
    otpChallengeId: objectIdSchema,
    password: z.string().min(8, "Password must be at least 8 characters."),
    phone: phoneSchema.optional(),
  })
  .refine((input) => input.email || input.phone, {
    message: "Email or phone is required.",
    path: ["email"],
  });

export const googleAuthSchema = z.object({
  idToken: z.string().trim().min(20, "Google ID token is required."),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type OtpRequestInput = z.infer<typeof otpRequestSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
