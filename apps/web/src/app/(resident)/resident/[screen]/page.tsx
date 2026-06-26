"use client";

import { useParams } from "next/navigation";

import { PortalExperiencePage } from "@/app/_components/portal-experience-page";

export default function ResidentScreenPage() {
  const params = useParams<{ screen: string }>();

  return <PortalExperiencePage portal="resident" screen={params.screen} />;
}
