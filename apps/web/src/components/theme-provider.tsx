"use client";

import type { ReactNode } from "react";

/**
 * Lightweight theme provider.
 *
 * The project forces "light" as the base theme (see layout.tsx).
 * Dark mode toggling is handled manually via `document.documentElement.classList`
 * in ThemeToggle. No external theme library is needed.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
