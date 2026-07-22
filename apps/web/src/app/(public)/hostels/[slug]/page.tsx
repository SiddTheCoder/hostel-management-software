import type { Metadata } from "next";

import { PublicHostelDetailPage } from "@/app/_components/public-hostel-detail-page";
import { getPublicHostelBySlug } from "@/modules/hostels/hostel.service";

type PageParams = {
  params: Promise<{ slug: string }>;
};

const HOSTEL_TYPE_LABEL: Record<string, string> = {
  BOYS: "boys",
  CO_LIVING: "co-living",
  GIRLS: "girls",
};

function truncate(value: string, max = 155) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { hostel } = await getPublicHostelBySlug(slug);
    const typeLabel = HOSTEL_TYPE_LABEL[hostel.hostelType] ?? "hostel";
    const area = [hostel.location?.area, hostel.location?.city]
      .filter(Boolean)
      .join(", ");
    const rentFrom = hostel.pricing?.monthlyRentMin
      ? ` Rent from NPR ${hostel.pricing.monthlyRentMin.toLocaleString()}/month.`
      : "";

    const description = hostel.description
      ? truncate(hostel.description)
      : truncate(
          `${hostel.name} is a verified ${typeLabel} hostel${area ? ` in ${area}` : ""}.${rentFrom} View photos, facilities, room types, location and reviews.`,
        );

    const title = area ? `${hostel.name} — ${area}` : hostel.name;
    const ogImage = hostel.photos?.[0]?.url;

    return {
      title,
      description,
      alternates: { canonical: `/hostels/${slug}` },
      openGraph: {
        title,
        description,
        type: "website",
        url: `/hostels/${slug}`,
        ...(ogImage ? { images: [{ url: ogImage, alt: hostel.name }] } : {}),
      },
    };
  } catch {
    return {
      title: "Hostel not found",
      description: "This hostel is no longer available or the link is incorrect.",
      robots: { index: false, follow: true },
    };
  }
}

export default function HostelDetailPage() {
  return <PublicHostelDetailPage />;
}
