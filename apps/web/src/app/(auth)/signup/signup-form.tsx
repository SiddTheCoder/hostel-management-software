"use client";

import { CheckCircle2, KeyRound, Mail, RefreshCw, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthResponse<T> =
  | {
      success: true;
      data: T;
      message: string;
    }
  | {
      success: false;
      errorCode: string;
      message: string;
    };

type OtpRequestData = {
  challengeId: string;
  devCode?: string;
  expiresAt: string;
};

type RegisterData = {
  user: {
    id: string;
    role: string;
  };
};

type SignupStep = "details" | "verify";

async function authRequest<T>(path: string, body: unknown) {
  const response = await fetch(path, {
    body: JSON.stringify(body),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const payload = (await response.json().catch(() => null)) as AuthResponse<T> | null;

  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message ?? "Request failed. Please try again.");
  }

  return payload.data;
}

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<SignupStep>("details");
  const [challengeId, setChallengeId] = useState("");
  const [devCode, setDevCode] = useState("");
  const [error, setError] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    code: "",
    email: "",
    name: "",
    password: "",
  });

  const identifier = form.email.trim().toLowerCase();

  async function sendOtp() {
    const data = await authRequest<OtpRequestData>("/api/v1/auth/otp/request", {
      channel: "email",
      identifier,
      purpose: "registration",
    });

    setChallengeId(data.challengeId);
    setDevCode(data.devCode ?? "");
    setExpiresAt(data.expiresAt);
    setForm((current) => ({ ...current, code: "" }));
    setStep("verify");
  }

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await sendOtp();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not send OTP. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendOtp() {
    setError("");
    setIsResending(true);

    try {
      await sendOtp();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Could not resend OTP. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  }

  async function completeSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await authRequest("/api/v1/auth/otp/verify", {
        challengeId,
        code: form.code,
      });
      await authRequest<RegisterData>("/api/v1/auth/register", {
        email: identifier,
        name: form.name,
        otpChallengeId: challengeId,
        password: form.password,
      });

      router.push("/hostels");
      router.refresh();
    } catch (signupError) {
      setError(
        signupError instanceof Error
          ? signupError.message
          : "Could not complete signup. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-6">
      {error ? (
        <div
          aria-live="polite"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </div>
      ) : null}

      {step === "details" ? (
        <form className="space-y-4" onSubmit={requestOtp}>
          <label className="block text-sm font-medium text-primary">
            Full name
            <span className="mt-2 flex h-11 items-center rounded-lg border border-border bg-role-resident-soft/40 px-3 text-primary transition focus-within:border-role-resident focus-within:ring-2 focus-within:ring-role-resident/20 dark:bg-muted/30">
              <UserRound className="mr-3 size-4 text-muted-foreground" />
              <input
                className="h-full w-full bg-transparent text-sm font-normal outline-none placeholder:text-muted-foreground"
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                placeholder="Asha Rai"
                required
                value={form.name}
              />
            </span>
          </label>

          <label className="block text-sm font-medium text-primary">
            Email
            <span className="mt-2 flex h-11 items-center rounded-lg border border-border bg-role-resident-soft/40 px-3 text-primary transition focus-within:border-role-resident focus-within:ring-2 focus-within:ring-role-resident/20 dark:bg-muted/30">
              <Mail className="mr-3 size-4 text-muted-foreground" />
              <input
                autoComplete="email"
                className="h-full w-full bg-transparent text-sm font-normal outline-none placeholder:text-muted-foreground"
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="name@example.com"
                required
                type="email"
                value={form.email}
              />
            </span>
          </label>

          <label className="block text-sm font-medium text-primary">
            Password
            <span className="mt-2 flex h-11 items-center rounded-lg border border-border bg-role-resident-soft/40 px-3 text-primary transition focus-within:border-role-resident focus-within:ring-2 focus-within:ring-role-resident/20 dark:bg-muted/30">
              <KeyRound className="mr-3 size-4 text-muted-foreground" />
              <input
                autoComplete="new-password"
                className="h-full w-full bg-transparent text-sm font-normal outline-none placeholder:text-muted-foreground"
                minLength={8}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="At least 8 characters"
                required
                type="password"
                value={form.password}
              />
            </span>
          </label>

          <button
            className="h-11 w-full rounded-lg bg-role-resident text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Sending OTP..." : "Send email OTP"}
          </button>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={completeSignup}>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="size-4" />
              OTP sent to {identifier}
            </div>
            {expiresAt ? (
              <p className="mt-2">
                Expires at {new Date(expiresAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            ) : null}
            {devCode ? (
              <p className="mt-2">
                Development code: <span className="font-mono font-bold">{devCode}</span>
              </p>
            ) : null}
          </div>

          <label className="block text-sm font-medium text-primary">
            Verification code
            <input
              className="mt-2 h-11 w-full rounded-lg border border-border bg-role-resident-soft/40 px-3 text-center font-mono text-lg tracking-[0.3em] text-primary outline-none transition focus:border-role-resident focus:ring-2 focus:ring-role-resident/20 dark:bg-muted/30"
              inputMode="numeric"
              maxLength={6}
              onChange={(event) =>
                setForm((current) => ({ ...current, code: event.target.value }))
              }
              placeholder="000000"
              required
              value={form.code}
            />
          </label>

          <button
            className="h-11 w-full rounded-lg bg-role-resident text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <button
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isResending || isSubmitting}
            onClick={() => void resendOtp()}
            type="button"
          >
            <RefreshCw className="size-4" />
            {isResending ? "Resending..." : "Resend email OTP"}
          </button>

          <button
            className="h-11 w-full rounded-lg border border-border text-sm font-semibold text-primary"
            onClick={() => {
              setStep("details");
              setChallengeId("");
              setDevCode("");
              setExpiresAt("");
              setForm((current) => ({ ...current, code: "" }));
            }}
            type="button"
          >
            Edit details
          </button>
        </form>
      )}
    </div>
  );
}
