"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, type FormEvent } from "react";

import { destinationForRole } from "@/lib/route-access";
import { Role } from "@/lib/roles";

import { GoogleAuthButton } from "../google-auth-button";

type LoginUser = {
  role: Role;
};

type LoginResponse =
  | {
      success: true;
      data: {
        user: LoginUser;
      };
      message: string;
    }
  | {
      success: false;
      errorCode: string;
      message: string;
    };

function destinationAfterLogin(role: Role) {
  const searchParams = new URLSearchParams(window.location.search);
  const requestedNext = searchParams.get("next");

  return destinationForRole(role, requestedNext);
}

const routeErrorMessages: Record<string, string> = {
  forbidden: "Your account is not allowed to open that portal.",
  invalid_session: "Your session could not be verified. Please login again.",
  session_expired: "Your session expired. Please login again.",
};

type LoginFormProps = {
  googleClientId: string;
};

export function LoginForm({ googleClientId }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const routeError = searchParams.get("error");
  const visibleError = error || (routeError ? routeErrorMessages[routeError] : "");
  const completeLogin = useCallback(
    async function completeLogin(response: Response) {
      const payload = (await response.json().catch(() => null)) as LoginResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message ?? "Login failed. Please try again.");
      }

      router.push(destinationAfterLogin(payload.data.user.role));
      router.refresh();
    },
    [router],
  );
  const handleGoogleSuccess = useCallback(
    (user: { role: Role }) => {
      router.push(destinationAfterLogin(user.role));
      router.refresh();
    },
    [router],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/auth/login", {
        body: JSON.stringify({
          identifier: identifier.trim().toLowerCase(),
          password,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      await completeLogin(response);
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
      {visibleError ? (
        <div
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {visibleError}
        </div>
      ) : null}

      <div className="space-y-4">
        <label className="block text-sm font-medium text-primary">
          Email
          <span className="mt-2 flex h-11 items-center rounded-lg border border-border bg-role-resident-soft/40 px-3 text-primary transition focus-within:border-role-resident focus-within:ring-2 focus-within:ring-role-resident/20 dark:bg-muted/30">
            <Mail className="mr-3 size-4 text-muted-foreground" />
            <input
              autoComplete="email"
              className="h-full w-full bg-transparent text-sm font-normal outline-none placeholder:text-muted-foreground"
              name="identifier"
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="name@example.com"
              required
              type="email"
              value={identifier}
            />
          </span>
        </label>

        <label className="block text-sm font-medium text-primary">
          <span className="flex items-center justify-between">
            Password
            <a
              className="text-xs font-medium text-role-resident hover:underline"
              href="/reset-password"
            >
              Forgot password?
            </a>
          </span>
          <span className="mt-2 flex h-11 items-center rounded-lg border border-border bg-role-resident-soft/40 px-3 text-primary transition focus-within:border-role-resident focus-within:ring-2 focus-within:ring-role-resident/20 dark:bg-muted/30">
            <LockKeyhole className="mr-3 size-4 text-muted-foreground" />
            <input
              autoComplete="current-password"
              className="h-full w-full bg-transparent text-sm font-normal outline-none placeholder:text-muted-foreground"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="ml-2 text-muted-foreground"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </span>
        </label>

        <label className="flex items-center gap-3 text-sm text-muted-foreground">
          <input
            className="size-4 rounded border-border text-role-resident focus:ring-role-resident"
            type="checkbox"
          />
          Remember me for 30 days
        </label>
      </div>

      <button
        className="h-11 w-full rounded-lg bg-role-resident text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        <p className="font-bold uppercase tracking-wide">Demo logins</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {[
            ["Super admin", "superadmin@gmail.com"],
            ["Hostel admin", "hosteladmin1@gmail.com"],
          ].map(([label, email]) => (
            <button
              className="rounded-md border border-amber-300 bg-white px-2 py-1.5 text-left font-semibold text-amber-900"
              key={email}
              onClick={() => {
                setIdentifier(email);
                setPassword("admin");
              }}
              type="button"
            >
              {label}
              <span className="block truncate font-mono text-[11px] font-normal">
                {email} / admin
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Or continue with
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <GoogleAuthButton
        clientId={googleClientId}
        onError={setError}
        onSuccess={handleGoogleSuccess}
      />

      <p className="pt-2 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a
          className="font-medium text-role-resident hover:underline"
          href={searchParams.get("next") ? `/signup?next=${encodeURIComponent(searchParams.get("next")!)}` : "/signup"}
        >
          Sign up
        </a>
      </p>
    </form>
  );
}
