"use client";

import { useParams } from "next/navigation";

import { PortalExperiencePage } from "@/components/desktop-ui";

export default function HostelAdminScreenPage() {
  const params = useParams<{ screen: string }>();

  return <PortalExperiencePage portal="admin" screen={params.screen} />;
}
