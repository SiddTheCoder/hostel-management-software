"use client";

import { Bell } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

import {
  EmptyState,
  LoadingRows,
  Panel,
  StatusBadge,
} from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  type LoadState,
  type Notice,
  ResidentHeader,
  Message,
} from "./resident-shared";

export const ResidentNoticesPageContent = memo(function ResidentNoticesPageContent() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ notices: Notice[] }>("/api/v1/resident/notices");

      setNotices(data.notices);
      setState("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load notices.");
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const markRead = useCallback(async (noticeId: string) => {
    try {
      await browserApi(`/api/v1/resident/notices/${noticeId}/read`, {
        body: JSON.stringify({}),
        method: "PATCH",
      });
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not mark notice read.");
    }
  }, [load]);

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <ResidentHeader
        description="Read hostel notices and keep your feed up to date."
        icon={Bell}
        title="Notices"
      />
      <Message value={message} />
      <Panel>
        {state === "loading" ? <LoadingRows /> : null}
        {state === "error" ? <EmptyState label="Notices could not be loaded." /> : null}
        {state === "ready" && notices.length === 0 ? (
          <EmptyState label="No notices." />
        ) : null}
        <div className="space-y-3">
          {notices.map((notice) => (
            <div className="rounded-lg border border-border p-4" key={notice.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-primary">{notice.title}</p>
                    {notice.isUrgent ? <StatusBadge>URGENT</StatusBadge> : null}
                    <StatusBadge>{notice.category}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{notice.content}</p>
                </div>
                {notice.isRead ? (
                  <StatusBadge>READ</StatusBadge>
                ) : (
                  <button
                    className="rounded-md bg-role-resident px-3 py-2 text-sm font-semibold text-white"
                    onClick={() => void markRead(notice.id)}
                    type="button"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
});
