"use client";

import { Bell } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";

import { browserApi } from "@/lib/browser-api";
import { type Notification, Message, PageHeader } from "./daily-operations-shared";
import { EmptyState, Panel, StatusBadge } from "@/app/_components/shared-ui";

export const NotificationsPageContent = memo(function NotificationsPageContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ notifications: Notification[] }>(
        "/api/v1/notifications",
      );

      setNotifications(data.notifications);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not load notifications.",
      );
    }
  }, []);

  const markRead = useCallback(
    async (id: string) => {
      try {
        await browserApi(`/api/v1/notifications/${id}/read`, {
          body: JSON.stringify({}),
          method: "PATCH",
        });
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not mark read.");
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
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        description="In-app notification feed."
        icon={Bell}
        title="Notifications"
      />
      <Message value={message} />
      <Panel>
        {notifications.length === 0 ? <EmptyState label="No notifications." /> : null}
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div className="rounded-lg border border-border p-4" key={notification.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{notification.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.body}
                  </p>
                </div>
                {notification.isRead ? (
                  <StatusBadge>READ</StatusBadge>
                ) : (
                  <button
                    className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                    onClick={() => void markRead(notification.id)}
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
