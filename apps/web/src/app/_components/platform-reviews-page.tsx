"use client";

import { Star } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

import { browserApi } from "@/lib/browser-api";
import { type Review, Message, PageHeader } from "./daily-operations-shared";
import { EmptyState, Panel, StatusBadge } from "@/app/_components/shared-ui";

export const PlatformReviewsPageContent = memo(function PlatformReviewsPageContent() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ reviews: Review[] }>("/api/v1/platform/reviews");

      setReviews(data.reviews);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load reviews.");
    }
  }, []);

  const moderate = useCallback(
    async (reviewId: string, action: "hide" | "unhide") => {
      try {
        await browserApi(`/api/v1/platform/reviews/${reviewId}/${action}`, {
          body: JSON.stringify({}),
          method: "PATCH",
        });
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not moderate review.");
      }
    },
    [load],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader description="Review moderation queue." icon={Star} title="Reviews" />
      <Message value={message} />
      <Panel>
        {reviews.length === 0 ? <EmptyState label="No reviews." /> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {reviews.map((review) => (
            <div className="rounded-lg border border-border p-4" key={review.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-foreground">
                  {review.overallRating}/5 review
                </p>
                <StatusBadge>{review.status}</StatusBadge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              <div className="mt-3 flex gap-2">
                <button
                  className="rounded-md border px-3 py-2 text-sm font-semibold"
                  onClick={() => void moderate(review.id, "hide")}
                  type="button"
                >
                  Hide
                </button>
                <button
                  className="rounded-md border px-3 py-2 text-sm font-semibold"
                  onClick={() => void moderate(review.id, "unhide")}
                  type="button"
                >
                  Unhide
                </button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
});
