"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
      duration: 1.05,
      lerp: 0.09,
      smoothWheel: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
