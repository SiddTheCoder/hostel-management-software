"use client";

import type { ReactNode } from "react";

export function ThemeProvider({
  children,
}: {
  attribute?: string;
  children: ReactNode;
  defaultTheme?: string;
  disableTransitionOnChange?: boolean;
  enableSystem?: boolean;
  forcedTheme?: string;
}) {
  return <>{children}</>;
}
