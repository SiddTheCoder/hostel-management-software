"use client";

import { memo } from "react";

import { ToggleSwitch } from "@/app/_components/portal-dashboard-ui";
import {
  ConfigCard,
  ConfigPage,
  Repeater,
  TextAreaField,
  TextField,
  parseListField,
  useSiteConfigDraft,
} from "./platform-config-shared";

export const PlatformConfigLocationsPageContent = memo(
  function PlatformConfigLocationsPageContent() {
    const {
      error,
      isDirty,
      message,
      reset,
      save,
      savingSection,
      setValue,
      state,
      valueFor,
    } = useSiteConfigDraft();

    const locations = valueFor("locations");

    return (
      <ConfigPage
        breadcrumb={["Home", "Website Config", "Locations"]}
        description="Cities and areas offered in public search filters, the compare page, and hostel registration. Disabled cities disappear from the public site immediately."
        error={error}
        message={message}
        state={state}
        title="Locations"
      >
        <ConfigCard
          description="Areas are comma separated and drive the area dropdown for each city."
          dirty={isDirty("locations")}
          onReset={() => reset("locations")}
          onSave={() => save("locations")}
          saving={savingSection === "locations"}
          title="Cities & Areas"
        >
          <Repeater
            addLabel="Add city"
            emptyLabel="No cities configured — public search filters will be empty."
            items={locations}
            makeItem={() => ({ areas: [], city: "", enabled: true })}
            max={40}
            onChange={(next) => setValue("locations", next)}
            renderRow={(location, patch) => (
              <div className="space-y-2.5">
                <div className="grid gap-2.5 sm:grid-cols-[1fr_200px]">
                  <TextField
                    label="City"
                    onChange={(city) => patch({ city })}
                    placeholder="Kathmandu"
                    value={location.city}
                  />
                  <ToggleSwitch
                    checked={location.enabled}
                    label="Show publicly"
                    onChange={(enabled) => patch({ enabled })}
                  />
                </div>
                <TextAreaField
                  hint="Comma separated, e.g. Baneshwor, Koteshwor, Kirtipur"
                  label="Areas"
                  onChange={(value) => patch({ areas: parseListField(value) })}
                  rows={2}
                  value={location.areas.join(", ")}
                />
              </div>
            )}
          />
        </ConfigCard>
      </ConfigPage>
    );
  },
);
