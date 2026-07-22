import type { Coordinates } from "./types";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
// Nominatim usage policy requires an identifying User-Agent (ARCHITECTURE.md §4.7).
const USER_AGENT = "HostelHub/1.0 (hostel discovery; +https://hostelhub.app)";

export type AddressParts = {
  address?: string;
  area?: string;
  city?: string;
  country?: string;
  province?: string;
};

export function buildAddressQuery(parts: AddressParts): string {
  return [parts.address, parts.area, parts.city, parts.province, parts.country ?? "Nepal"]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(", ");
}

/**
 * Address → coordinates. Server-only (protects the API key). Prefers Google
 * when a server key is set, otherwise Nominatim (OpenStreetMap). Returns null on
 * any failure so callers can degrade gracefully.
 */
export async function geocodeAddress(parts: AddressParts): Promise<Coordinates | null> {
  // Try the full address first, then fall back to a coarser area/city query.
  // Many Nepali addresses have vague or placeholder streets that geocoders
  // can't resolve verbatim — the coarser query still pins the right locality.
  const full = buildAddressQuery(parts);
  const coarse = buildAddressQuery({
    area: parts.area,
    city: parts.city,
    country: parts.country,
    province: parts.province,
  });
  const queries = [full, coarse].filter(
    (query, index, all) => query.length > 0 && all.indexOf(query) === index,
  );

  for (const query of queries) {
    if (process.env.GOOGLE_MAPS_API_KEY) {
      const viaGoogle = await geocodeWithGoogle(query).catch(() => null);
      if (viaGoogle) {
        return viaGoogle;
      }
    }

    const viaNominatim = await geocodeWithNominatim(query).catch(() => null);
    if (viaNominatim) {
      return viaNominatim;
    }
  }

  return null;
}

async function geocodeWithNominatim(query: string): Promise<Coordinates | null> {
  const url = `${NOMINATIM_URL}?format=json&limit=1&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { "Accept-Language": "en", "User-Agent": USER_AGENT },
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as Array<{ lat: string; lon: string }>;
  const first = data[0];
  if (!first) {
    return null;
  }

  return { lat: Number(first.lat), lng: Number(first.lon) };
}

async function geocodeWithGoogle(query: string): Promise<Coordinates | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${key}`;
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as {
    results?: Array<{ geometry: { location: { lat: number; lng: number } } }>;
  };
  const location = data.results?.[0]?.geometry.location;

  return location ? { lat: location.lat, lng: location.lng } : null;
}
