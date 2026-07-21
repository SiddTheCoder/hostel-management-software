"use client";

import React, { useState, useEffect } from "react";
import { Gift } from "lucide-react";
import { EmptyState, Panel, StatusBadge } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import { Message, PageHeader, type Referral } from "./portal-shared";

export const ResidentReferralPageContent = React.memo(
  function ResidentReferralPageContent() {
    const [referralCode, setReferralCode] = useState<{
      code: string;
      joinedCount: number;
      link: string;
      rewardCount: number;
    } | null>(null);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
      async function load() {
        try {
          const data = await browserApi<{
            referralCode: NonNullable<typeof referralCode>;
            referrals: Referral[];
          }>("/api/v1/resident/referral");

          setReferralCode(data.referralCode);
          setReferrals(data.referrals);
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "Could not load referral.");
        }
      }

      const timer = window.setTimeout(() => {
        void load();
      }, 0);

      return () => window.clearTimeout(timer);
    }, []);

    return (
      <div className="mx-auto max-w-[900px] space-y-6">
        <PageHeader
          description="Share your referral code with a friend joining the hostel."
          icon={Gift}
          title="Referral"
        />
        <Message value={message} />
        <Panel title="Your Code">
          {referralCode ? (
            <div>
              <p className="font-mono text-4xl font-bold tracking-widest text-role-resident">
                {referralCode.code}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {referralCode.link} / Joined {referralCode.joinedCount} / Rewards{" "}
                {referralCode.rewardCount}
              </p>
            </div>
          ) : (
            <EmptyState label="Referral code is not loaded." />
          )}
        </Panel>
        <Panel title="Referred Inquiries">
          {referrals.length === 0 ? <EmptyState label="No referrals yet." /> : null}
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div className="rounded-lg border border-border p-4" key={referral.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{referral.name}</p>
                    <p className="text-sm text-muted-foreground">{referral.phone}</p>
                  </div>
                  <StatusBadge>{referral.status}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    );
  },
);
