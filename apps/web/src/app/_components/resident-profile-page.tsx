"use client";

import { UserRound } from "lucide-react";
import { memo, useEffect, useState } from "react";

import {
  EmptyState,
  LoadingRows,
  Panel,
  StatusBadge,
} from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  type LoadState,
  type ResidentDashboard,
  type ResidentSummary,
  ResidentHeader,
  Message,
} from "./resident-shared";

export const ResidentProfilePageContent = memo(function ResidentProfilePageContent() {
  const [profile, setProfile] = useState<{
    emergencyContacts: Array<{
      id: string;
      name: string;
      phone: string;
      relation: string;
    }>;
    guardians: Array<{
      firstName: string;
      id: string;
      lastName: string;
      phone: string;
      relation: string;
    }>;
    resident: ResidentSummary;
    roomBed: ResidentDashboard["roomBed"];
  } | null>(null);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      setState("loading");
      try {
        const data = await browserApi<{ profile: NonNullable<typeof profile> }>(
          "/api/v1/resident/profile",
        );

        setProfile(data.profile);
        setState("ready");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load profile.");
        setState("error");
      }
    }

    void load();
  }, []);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <ResidentHeader
        description="Your resident record and hostel contact information."
        icon={UserRound}
        title="My Profile"
      />
      <Message value={message} />
      {state === "loading" ? <LoadingRows /> : null}
      {state === "error" ? <EmptyState label="Profile could not be loaded." /> : null}
      {profile ? (
        <div className="grid gap-5 xl:grid-cols-3">
          <Panel title="Resident">
            <p className="text-xl font-bold text-primary">
              {profile.resident.firstName} {profile.resident.lastName}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{profile.resident.phone}</p>
            <p className="mt-1 text-sm text-muted-foreground">{profile.resident.email}</p>
            <div className="mt-4">
              <StatusBadge>{profile.resident.status}</StatusBadge>
            </div>
          </Panel>
          <Panel title="Room & Bed">
            <p className="text-sm text-muted-foreground">Room</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {profile.roomBed.room?.roomNumber ?? "-"}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">Bed</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {profile.roomBed.bed?.bedNumber ?? "-"}
            </p>
          </Panel>
          <Panel title="Contacts">
            <div className="space-y-4">
              {profile.guardians.map((guardian) => (
                <div key={guardian.id}>
                  <p className="font-semibold text-primary">
                    {guardian.firstName} {guardian.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {guardian.relation} / {guardian.phone}
                  </p>
                </div>
              ))}
              {profile.emergencyContacts.map((contact) => (
                <div key={contact.id}>
                  <p className="font-semibold text-primary">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {contact.relation} / {contact.phone}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      ) : null}
    </div>
  );
});
