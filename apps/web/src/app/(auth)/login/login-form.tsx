"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { destinationForRole } from "@/lib/route-access";
import { Role } from "@/lib/roles";

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

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const identifier = String(formData.get("identifier") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const response = await fetch("/api/v1/auth/login", {
        body: JSON.stringify({ identifier, password }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as LoginResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message ?? "Login failed. Please try again.");
      }

      router.push(destinationAfterLogin(payload.data.user.role));
      router.refresh();
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
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      {error ? (
        <div
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      ) : null}

      <label className="block text-sm font-semibold text-primary">
        Email or phone
        <input
          autoComplete="username"
          className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-4 text-sm font-normal outline-none ring-secondary/20 transition focus:border-secondary focus:ring-4"
          name="identifier"
          placeholder="admin@example.com"
          required
          type="text"
        />
      </label>

      <label className="block text-sm font-semibold text-primary">
        Password
        <input
          autoComplete="current-password"
          className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-4 text-sm font-normal outline-none ring-secondary/20 transition focus:border-secondary focus:ring-4"
          minLength={8}
          name="password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </label>

      <button
        className="h-12 w-full rounded-lg bg-secondary text-sm font-bold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Login"}
      </button>
    </form>
  );
}
