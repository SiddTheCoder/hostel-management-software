"use client";

import type { Coordinates } from "@/lib/maps/types";

/**
 * Google Maps variant (ARCHITECTURE.md §4.4). Uses the keyless-to-us Maps Embed
 * API iframe with the referrer-restricted browser key — no JS SDK, no exposed
 * server key. Only rendered when `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` is set
 * (the provider switch handles that); falls back to Leaflet otherwise.
 */
export function GoogleMap({ center, name }: { center: Coordinates; name: string }) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY;
  if (!key) {
    return null;
  }

  const src =
    `https://www.google.com/maps/embed/v1/place?key=${key}` +
    `&q=${center.lat},${center.lng}&zoom=15`;

  return (
    <iframe
      allowFullScreen
      className="h-full w-full border-0"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={src}
      title={`Map showing ${name}`}
    />
  );
}
