"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

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

type GoogleCredentialResponse = {
  credential?: string;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            callback: (response: GoogleCredentialResponse) => void;
            client_id: string;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              shape?: "rectangular" | "pill" | "circle" | "square";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              theme?: "outline" | "filled_blue" | "filled_black";
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

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

export function LoginForm() {
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const routeError = searchParams.get("error");
  const visibleError = error || (routeError ? routeErrorMessages[routeError] : "");
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return;
    }

    const clientId = googleClientId;
    let isMounted = true;

    async function handleGoogleCredential(response: GoogleCredentialResponse) {
      if (!response.credential) {
        setError("Google did not return a sign-in token.");
        return;
      }

      setError("");
      setIsGoogleSubmitting(true);

      try {
        const googleResponse = await fetch("/api/v1/auth/google", {
          body: JSON.stringify({ idToken: response.credential }),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });

        await completeLogin(googleResponse);
      } catch (googleError) {
        setError(
          googleError instanceof Error
            ? googleError.message
            : "Google sign-in failed. Please try again.",
        );
      } finally {
        setIsGoogleSubmitting(false);
      }
    }

    function renderGoogleButton() {
      if (!isMounted || !window.google || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        callback: handleGoogleCredential,
        client_id: clientId,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        shape: "rectangular",
        size: "large",
        text: "continue_with",
        theme: "outline",
        width: googleButtonRef.current.offsetWidth || 320,
      });
      setIsGoogleReady(true);
    }

    if (window.google) {
      renderGoogleButton();
    } else {
      const script = document.createElement("script");

      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      script.src = "https://accounts.google.com/gsi/client";
      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
    };
  }, [completeLogin, googleClientId]);

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
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      {visibleError ? (
        <div
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {visibleError}
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

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          or
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div ref={googleButtonRef} className="min-h-11 w-full" />
      {!googleClientId ? (
        <p className="text-sm text-muted-foreground">
          Google sign-in is waiting for `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.
        </p>
      ) : !isGoogleReady || isGoogleSubmitting ? (
        <p className="text-sm text-muted-foreground">
          {isGoogleSubmitting ? "Completing Google sign-in..." : "Loading Google..."}
        </p>
      ) : null}
    </form>
  );
}
