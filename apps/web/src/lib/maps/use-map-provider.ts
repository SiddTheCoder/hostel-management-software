"use client";

import { useState } from "react";

import type { MapProvider } from "./types";

/**
 * Client-side provider selection (ARCHITECTURE.md §4.2). Google is chosen only
 * when a public browser key is configured at build time; otherwise Leaflet/OSM.
 * Evaluated once (lazy state initialiser) — no effect, so no cascading render.
 */
export function useMapProvider(): MapProvider {
  const [provider] = useState<MapProvider>(() =>
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY ? "google" : "osm",
  );

  return provider;
}
