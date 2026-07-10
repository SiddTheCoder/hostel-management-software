"use client";

import { useEffect, useRef, useState } from "react";

import { Role } from "@/lib/roles";

type GoogleAuthUser = {
  role: Role;
};

type GoogleAuthResponse =
  | {
      success: true;
      data: {
        user: GoogleAuthUser;
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

type GoogleAuthButtonProps = {
  clientId: string;
  onError: (message: string) => void;
  onSuccess: (user: GoogleAuthUser) => void;
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
              locale?: string;
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

const googleScriptId = "google-identity-services";

export function GoogleAuthButton({
  clientId,
  onError,
  onSuccess,
}: GoogleAuthButtonProps) {
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!clientId || !buttonRef.current) {
      return;
    }

    let isMounted = true;

    async function handleGoogleCredential(response: GoogleCredentialResponse) {
      if (!response.credential) {
        onError("Google did not return a sign-in token.");
        return;
      }

      onError("");
      setIsSubmitting(true);

      try {
        const googleResponse = await fetch("/api/v1/auth/google", {
          body: JSON.stringify({ idToken: response.credential }),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        });
        const payload = (await googleResponse
          .json()
          .catch(() => null)) as GoogleAuthResponse | null;

        if (!googleResponse.ok || !payload?.success) {
          throw new Error(payload?.message ?? "Google sign-in failed.");
        }

        onSuccess(payload.data.user);
      } catch (error) {
        onError(
          error instanceof Error
            ? error.message
            : "Google sign-in failed. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    }

    function renderGoogleButton() {
      if (!isMounted || !window.google || !buttonRef.current) {
        return;
      }

      buttonRef.current.replaceChildren();
      window.google.accounts.id.initialize({
        callback: handleGoogleCredential,
        client_id: clientId,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        locale: "en",
        shape: "rectangular",
        size: "large",
        text: "continue_with",
        theme: "outline",
        width: buttonRef.current.offsetWidth || 320,
      });
      setIsReady(true);
    }

    if (window.google) {
      renderGoogleButton();
      return () => {
        isMounted = false;
      };
    }

    const existingScript = document.getElementById(googleScriptId);
    const script =
      existingScript instanceof HTMLScriptElement
        ? existingScript
        : document.createElement("script");

    function handleScriptError() {
      if (isMounted) {
        onError("Could not load Google sign-in. Please try email login.");
      }
    }

    script.addEventListener("load", renderGoogleButton);
    script.addEventListener("error", handleScriptError);

    if (!existingScript) {
      script.async = true;
      script.defer = true;
      script.id = googleScriptId;
      script.src = "https://accounts.google.com/gsi/client";
      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
      script.removeEventListener("load", renderGoogleButton);
      script.removeEventListener("error", handleScriptError);
    };
  }, [clientId, onError, onSuccess]);

  return (
    <>
      <div ref={buttonRef} className="min-h-11 w-full overflow-hidden rounded-lg" />
      {!clientId ? (
        <button
          className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface text-sm font-medium text-primary transition hover:bg-muted dark:bg-card"
          onClick={() =>
            onError(
              "Google sign-in is not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID to enable it.",
            )
          }
          type="button"
        >
          <span className="font-bold text-[#4285f4]">G</span>
          Continue with Google
        </button>
      ) : !isReady || isSubmitting ? (
        <p className="text-sm text-muted-foreground">
          {isSubmitting ? "Completing Google sign-in..." : "Loading Google..."}
        </p>
      ) : null}
    </>
  );
}
