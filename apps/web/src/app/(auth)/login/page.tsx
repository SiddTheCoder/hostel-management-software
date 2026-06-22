import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl shadow-slate-200/70">
        <Link href="/" className="text-sm font-semibold text-secondary">
          Back to HostelHub
        </Link>
        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Secure access
          </p>
          <h1 className="mt-2 text-3xl font-bold text-primary">Login</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Platform owners, hostel staff, residents, and guardians use the same account
            entry point. Role-specific dashboards load after login.
          </p>
        </div>

        <Suspense
          fallback={
            <p className="mt-8 text-sm text-muted-foreground">Loading login form...</p>
          }
        >
          <LoginForm />
        </Suspense>
      </section>
    </main>
  );
}
