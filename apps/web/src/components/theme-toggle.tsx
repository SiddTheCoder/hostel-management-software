"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
  };

  const label = mounted
    ? isDark
      ? "Switch to light theme"
      : "Switch to dark theme"
    : "Toggle color theme";

  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground shadow-sm transition hover:border-secondary hover:text-secondary dark:bg-card",
        className,
      )}
      onClick={toggleTheme}
      title={mounted ? (isDark ? "Light theme" : "Dark theme") : "Toggle color theme"}
      type="button"
    >
      {mounted && isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
