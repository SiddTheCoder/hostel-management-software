"use client";

import React, { useCallback, useState, useEffect, type FormEvent } from "react";
import { Gift } from "lucide-react";
import { EmptyState, Panel, StatusBadge } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  Message,
  PageHeader,
  optionalField,
  optionalNumber,
  type Referral,
} from "./phase5-shared";

export const HostelAdminReferralsPageContent = React.memo(
  function HostelAdminReferralsPageContent() {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [message, setMessage] = useState("");

    const load = useCallback(async () => {
      try {
        const data = await browserApi<{ referrals: Referral[] }>(
          "/api/v1/hostel-admin/referrals",
        );

        setReferrals(data.referrals);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not load referrals.");
      }
    }, []);

    useEffect(() => {
      const timer = window.setTimeout(() => {
        void load();
      }, 0);

      return () => window.clearTimeout(timer);
    }, [load]);

    const confirm = useCallback(
      async (event: FormEvent<HTMLFormElement>, referralId: string) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);

        try {
          await browserApi(`/api/v1/hostel-admin/referrals/${referralId}/confirm`, {
            body: JSON.stringify({
              rewardAmount: optionalNumber(form, "rewardAmount"),
              rewardNotes: optionalField(form, "rewardNotes"),
            }),
            method: "PATCH",
          });
          setMessage("Referral confirmed.");
          await load();
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not confirm referral.");
        }
      },
      [load, setMessage],
    );

    return (
      <div className="mx-auto max-w-[1448px] space-y-6">
        <PageHeader
          description="Confirm referred residents who joined and track rewards."
          icon={Gift}
          title="Referrals"
        />
        <Message value={message} />
        <Panel>
          {referrals.length === 0 ? <EmptyState label="No referrals." /> : null}
          <div className="grid gap-3 xl:grid-cols-2">
            {referrals.map((referral) => (
              <div className="rounded-lg border border-border p-4" key={referral.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">{referral.phone}</p>
                  </div>
                  <StatusBadge>{referral.status}</StatusBadge>
                </div>
                <form
                  className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
                  onSubmit={(event) => confirm(event, referral.id)}
                >
                  <input
                    className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                    name="rewardAmount"
                    placeholder="Reward amount"
                    type="number"
                  />
                  <input
                    className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                    name="rewardNotes"
                    placeholder="Reward notes"
                  />
                  <button className="h-10 rounded-md bg-role-admin px-3 text-sm font-semibold text-white">
                    Confirm
                  </button>
                </form>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    );
  },
);
