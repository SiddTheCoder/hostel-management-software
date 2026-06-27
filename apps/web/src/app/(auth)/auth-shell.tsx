import { Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  subtitle: string;
  title: string;
};

export function AuthShell({ children, subtitle, title }: AuthShellProps) {
  return (
    <main className="h-screen overflow-hidden bg-background text-foreground">
      <div className="grid h-screen overflow-hidden bg-surface shadow-sm lg:grid-cols-[0.9fr_1.1fr] dark:bg-card">
        <section className="hidden min-h-0 bg-role-resident-soft/50 p-8 lg:flex lg:flex-col lg:justify-between">
          <div className="min-h-0">
            <Link className="inline-flex items-center gap-3 text-role-resident" href="/">
              <Building2 className="size-9" />
              <span className="font-heading text-3xl font-bold">HostelHub</span>
            </Link>
            <div className="mt-10 max-w-md">
              <h1 className="font-heading text-3xl font-bold leading-tight text-primary xl:text-4xl">
                One account for hostel discovery, resident access, and daily updates.
              </h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground xl:text-base">
                Students create an email-based account first. Hostel admins can later link
                that account to an admin-created resident record.
              </p>
            </div>
            <div
              className="mt-8 h-[32vh] min-h-48 rounded-xl bg-cover bg-center shadow-sm"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80")',
              }}
            />
          </div>
          <div className="mt-5 rounded-lg border border-role-resident/20 bg-surface/80 p-4 text-sm shadow-sm dark:bg-card/80">
            <div className="flex items-center gap-3 font-semibold text-primary">
              <ShieldCheck className="size-5 text-role-resident" />
              Email OTP, password, and Google sign-in
            </div>
            <p className="mt-2 text-muted-foreground">
              Phone numbers remain resident contact data managed inside hostel operations.
            </p>
          </div>
        </section>

        <section className="flex min-h-0 items-center justify-center overflow-hidden px-5 py-5 md:px-10">
          <div className="w-full max-w-md">
            <Link className="mb-6 inline-flex items-center gap-2 lg:hidden" href="/">
              <Building2 className="size-7 text-role-resident" />
              <span className="font-heading text-2xl font-bold text-primary">
                HostelHub
              </span>
            </Link>
            <h2 className="font-heading text-2xl font-bold text-primary md:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</p>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
