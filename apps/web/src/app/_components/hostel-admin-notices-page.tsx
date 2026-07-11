"use client";

import { Bell, ShieldCheck } from "lucide-react";
import { memo, useCallback, useEffect, useState, type FormEvent } from "react";

import {
  EmptyState,
  Input,
  LoadingRows,
  Panel,
  Select,
  StatusBadge,
  TextArea,
} from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";

import {
  field,
  optionalField,
  PageHeader,
  type LoadState,
  type Notice,
} from "./hostel-admin-shared";

export const HostelAdminNoticesPage = memo(function HostelAdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    try {
      const data = await browserApi<{ notices: Notice[] }>(
        "/api/v1/hostel-admin/notices",
      );

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

  const handleCreateNotice = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);

      try {
        await browserApi("/api/v1/hostel-admin/notices", {
          body: JSON.stringify({
            category: field(form, "category"),
            content: field(form, "content"),
            expiresAt: optionalField(form, "expiresAt"),
            isUrgent: form.get("isUrgent") === "on",
            title: field(form, "title"),
          }),
          method: "POST",
        });
        event.currentTarget.reset();
        setMessage("Notice published.");
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not publish notice.");
      }
    },
    [load],
  );

  return (
    <div className="mx-auto max-w-[1448px] space-y-6">
      <PageHeader
        description="Publish notices and keep resident read status available."
        icon={Bell}
        title="Notices"
      />
      {message ? (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
          {message}
        </div>
      ) : null}
      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Panel title="Published Notices">
          {state === "loading" ? <LoadingRows /> : null}
          {state === "error" ? <EmptyState label="Notices could not be loaded." /> : null}
          {state === "ready" && notices.length === 0 ? (
            <EmptyState label="No notices published." />
          ) : null}
          <div className="space-y-3">
            {notices.map((notice) => (
              <div className="rounded-lg border border-border p-4" key={notice.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-primary">{notice.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{notice.content}</p>
                  </div>
                  <div className="flex gap-2">
                    {notice.isUrgent ? <StatusBadge>URGENT</StatusBadge> : null}
                    <StatusBadge>{notice.category}</StatusBadge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Create Notice">
          <form className="grid gap-3" onSubmit={handleCreateNotice}>
            <Input label="Title" name="title" required />
            <Select label="Category" name="category" required>
              {[
                "GENERAL",
                "URGENT",
                "EVENT",
                "RULE",
                "MAINTENANCE",
                "PAYMENT",
                "FOOD",
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            <TextArea label="Content" name="content" />
            <Input label="Expires at" name="expiresAt" type="date" />
            <label className="flex items-center gap-2 text-sm text-primary">
              <input name="isUrgent" type="checkbox" />
              Urgent
            </label>
            <button className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-role-admin text-sm font-semibold text-white">
              <ShieldCheck className="size-4" />
              Publish Notice
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
});
