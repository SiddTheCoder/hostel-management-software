"use client";

import { useParams } from "next/navigation";

import { PortalExperiencePage } from "@/components/desktop-ui";

export default function PlatformScreenPage() {
  const params = useParams<{ screen: string }>();

  return <PortalExperiencePage portal="platform" screen={params.screen} />;
}
