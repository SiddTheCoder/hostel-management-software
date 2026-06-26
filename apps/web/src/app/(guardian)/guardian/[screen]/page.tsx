"use client";

import { useParams } from "next/navigation";

import { PortalExperiencePage } from "@/app/_components/portal-experience-page";

export default function GuardianScreenPage() {
  const params = useParams<{ screen: string }>();

  return <PortalExperiencePage portal="guardian" screen={params.screen} />;
}
