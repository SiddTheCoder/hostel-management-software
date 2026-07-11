import { Suspense } from "react";

import { AuthShell } from "../auth-shell";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  return (
    <AuthShell mode="login">
      <Suspense
        fallback={<p className="mt-6 text-sm text-muted-foreground">Loading login...</p>}
      >
        <LoginForm googleClientId={googleClientId} />
      </Suspense>
    </AuthShell>
  );
}
