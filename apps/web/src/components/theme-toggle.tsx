"use client";

import { Moon, Sun } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  };

  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground shadow-sm transition hover:border-secondary hover:text-secondary dark:bg-card",
        className,
      )}
      onClick={toggleTheme}
      title={isDark ? "Light theme" : "Dark theme"}
      type="button"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
