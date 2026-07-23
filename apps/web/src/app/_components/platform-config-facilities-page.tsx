"use client";

import { memo } from "react";

import { ToggleSwitch } from "@/app/_components/portal-dashboard-ui";
import {
  ConfigCard,
  ConfigPage,
  Repeater,
  TextField,
  useSiteConfigDraft,
} from "./platform-config-shared";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const PlatformConfigFacilitiesPageContent = memo(
  function PlatformConfigFacilitiesPageContent() {
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

    const facilities = valueFor("facilities");

    return (
      <ConfigPage
        breadcrumb={["Home", "Website Config", "Facilities"]}
        description="The amenity catalogue used by listing cards, search filters, and hostel comparison. The slug is what hostels store, so avoid renaming slugs once listings use them."
        error={error}
        message={message}
        state={state}
        title="Facilities"
      >
        <ConfigCard
          dirty={isDirty("facilities")}
          onReset={() => reset("facilities")}
          onSave={() => save("facilities")}
          saving={savingSection === "facilities"}
          title="Facility Catalogue"
        >
          <Repeater
            addLabel="Add facility"
            emptyLabel="No facilities configured — the amenity filter will be hidden."
            items={facilities}
            makeItem={() => ({ enabled: true, icon: "sparkles", label: "", slug: "" })}
            max={60}
            onChange={(next) => setValue("facilities", next)}
            renderRow={(facility, patch) => (
              <div className="grid gap-2.5 sm:grid-cols-[1fr_1fr_140px_150px]">
                <TextField
                  label="Label"
                  onChange={(label) => {
                    // Keep the slug in step only while it is still auto-derived;
                    // a hand-edited slug is left alone so existing hostel records
                    // that reference it stay valid.
                    const autoDerived =
                      facility.slug === "" || facility.slug === slugify(facility.label);

                    patch(autoDerived ? { label, slug: slugify(label) } : { label });
                  }}
                  placeholder="Free WiFi"
                  value={facility.label}
                />
                <TextField
                  hint="Stored on hostel records"
                  label="Slug"
                  onChange={(slug) => patch({ slug: slugify(slug) })}
                  placeholder="wifi"
                  value={facility.slug}
                />
                <TextField
                  label="Icon"
                  onChange={(icon) => patch({ icon })}
                  placeholder="wifi"
                  value={facility.icon}
                />
                <ToggleSwitch
                  checked={facility.enabled}
                  label="Show publicly"
                  onChange={(enabled) => patch({ enabled })}
                />
              </div>
            )}
          />
        </ConfigCard>
      </ConfigPage>
    );
  },
);
