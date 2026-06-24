"use client";

import { useParams } from "next/navigation";

import { PortalExperiencePage } from "@/components/desktop-ui";

export default function GuardianScreenPage() {
  const params = useParams<{ screen: string }>();

  return <PortalExperiencePage portal="guardian" screen={params.screen} />;
}
