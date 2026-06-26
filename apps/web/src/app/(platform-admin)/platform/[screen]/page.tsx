"use client";

import { useParams } from "next/navigation";

import { PortalExperiencePage } from "@/app/_components/portal-experience-page";

export default function PlatformScreenPage() {
  const params = useParams<{ screen: string }>();

  return <PortalExperiencePage portal="platform" screen={params.screen} />;
}
