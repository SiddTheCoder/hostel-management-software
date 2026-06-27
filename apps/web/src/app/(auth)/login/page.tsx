import { Suspense } from "react";

import { AuthShell } from "../auth-shell";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <AuthShell
      subtitle="Sign in with your email and password, or continue with Google."
      title="Login to HostelHub"
    >
      <Suspense fallback={<p className="mt-10 text-sm text-muted-foreground">Loading login...</p>}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
