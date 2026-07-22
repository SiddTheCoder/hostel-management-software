import type { MapProvider } from "./types";

/**
 * Server-side map/geocoding provider selection (ARCHITECTURE.md §4.2).
 * Google is used only when a server key is configured; otherwise the free
 * OpenStreetMap stack (Nominatim + Overpass) is the default.
 */
export function getMapProvider(): MapProvider {
  return process.env.GOOGLE_MAPS_API_KEY ? "google" : "osm";
}

export function hasGoogleServerKey(): boolean {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY);
}
