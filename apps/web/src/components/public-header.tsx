import { Heart, Home } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type PublicHeaderProps = {
  active: "blog" | "browse" | "compare" | "home" | "pricing" | "providers";
};

const navItems = [
  { href: "/", id: "home", label: "Home" },
  { href: "/hostels", id: "browse", label: "Hostels" },
  { href: "/compare", id: "compare", label: "Compare" },
  { href: "/service-providers/register", id: "providers", label: "Service Providers" },
  { href: "/#blog", id: "blog", label: "Blog" },
  { href: "/#about", id: "about", label: "About Us" },
  { href: "/#contact", id: "contact", label: "Contact" },
] as const;

export function PublicHeader({ active }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur dark:bg-card/95">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-bold text-brand-teal"
        >
          <Home className="size-7 fill-brand-teal/10" />
          HostelHub
        </Link>
        <nav className="hidden h-full items-center gap-7 text-sm font-semibold text-primary md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex h-full items-center border-b-2 border-transparent pt-1 transition hover:text-brand-teal",
                active === item.id &&
                  "border-b-2 border-brand-teal font-bold text-brand-teal",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            aria-label="Saved hostels"
            className="hidden size-10 items-center justify-center rounded-full border border-border text-primary transition hover:border-brand-teal hover:text-brand-teal md:inline-flex"
            type="button"
          >
            <Heart className="size-5" />
          </button>
          <Link
            href="/login"
            className="hidden rounded-lg bg-brand-teal px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 md:inline-flex"
          >
            Login / Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
