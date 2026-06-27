import { z } from "zod";

import { objectIdSchema } from "@/lib/validators";

export const loginSchema = z.object({
  identifier: z.string().trim().email("Expected a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const otpChannelSchema = z.enum(["email"]);

export const otpPurposeSchema = z.enum(["registration"]);

export const otpRequestSchema = z
  .object({
    channel: otpChannelSchema,
    identifier: z.string().trim().email("Expected a valid email address."),
    purpose: otpPurposeSchema.default("registration"),
  })
  .superRefine((input, context) => {
    const result = z.string().email().safeParse(input.identifier);

    if (!result.success) {
      context.addIssue({
        code: "custom",
        message: "Expected a valid email address.",
        path: ["identifier"],
      });
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
    email: z.string().trim().email(),
    name: z.string().trim().min(2, "Name is required.").max(120),
    otpChallengeId: objectIdSchema,
    password: z.string().min(8, "Password must be at least 8 characters."),
  })
  .refine((input) => Boolean(input.email), {
    message: "Email is required.",
    path: ["email"],
  });

export const googleAuthSchema = z.object({
  idToken: z.string().trim().min(20, "Google ID token is required."),
});

export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type OtpRequestInput = z.infer<typeof otpRequestSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
