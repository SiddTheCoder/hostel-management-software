"use client";

import { Siren } from "lucide-react";
import { memo, useCallback, useEffect, useState, type FormEvent } from "react";

import { browserApi } from "@/lib/browser-api";
import { field, Message, PageHeader } from "./daily-operations-shared";
import { EmptyState, Panel, TextArea } from "@/app/_components/shared-ui";

export const ResidentSOSPageContent = memo(function ResidentSOSPageContent() {
  const [contacts, setContacts] = useState<
    Array<{ id: string; name: string; phone: string; relation: string }>
  >([]);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ contacts: typeof contacts }>(
        "/api/v1/resident/emergency-contacts",
      );

      setContacts(data.contacts);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load contacts.");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [load]);

  const trigger = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await browserApi("/api/v1/resident/sos", {
        body: JSON.stringify({
          guardianAlertEnabled: form.get("guardianAlertEnabled") === "on",
          message: field(form, "message"),
        }),
        method: "POST",
      });
      setMessage("SOS alert triggered.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not trigger SOS.");
    }
  }, []);

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <PageHeader
        description="Trigger an emergency alert for hostel staff."
        icon={Siren}
        title="SOS"
      />
      <Message value={message} />
      <Panel title="Emergency Alert">
        <form className="grid gap-3" onSubmit={trigger}>
          <TextArea label="Message" name="message" />
          <label className="flex items-center gap-2 text-sm text-primary">
            <input name="guardianAlertEnabled" type="checkbox" />
            Alert guardian if enabled
          </label>
          <button className="h-11 rounded-md bg-rose-600 text-sm font-semibold text-white">
            Trigger SOS
          </button>
        </form>
      </Panel>
      <Panel title="Emergency Contacts">
        {contacts.length === 0 ? <EmptyState label="No emergency contacts." /> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {contacts.map((contact) => (
            <div className="rounded-lg border border-border p-4" key={contact.id}>
              <p className="font-semibold text-primary">{contact.name}</p>
              <p className="text-sm text-muted-foreground">
                {contact.relation} / {contact.phone}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
});
