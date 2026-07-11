"use client";

import { Home } from "lucide-react";
import { memo, useCallback, useEffect, useState, type FormEvent } from "react";

import { EmptyState, Input, Panel, Select, TextArea } from "@/app/_components/shared-ui";
import { browserApi } from "@/lib/browser-api";
import {
  csvField,
  deferLoad,
  DemoDataBadge,
  field,
  Hostel,
  Message,
  numberField,
  optionalField,
  PageHeader,
} from "./core-portal-shared";

export const HostelAdminProfilePageContent = memo(function HostelAdminProfilePageContent() {
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await browserApi<{ hostel: Hostel }>("/api/v1/hostel-admin/profile");

      setHostel(data.hostel);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load profile.");
    }
  }, []);

  useEffect(() => deferLoad(load), [load]);

  const save = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);

      try {
        await browserApi("/api/v1/hostel-admin/profile", {
          body: JSON.stringify({
            contact: {
              email: optionalField(form, "email"),
              phone: optionalField(form, "phone"),
            },
            description: optionalField(form, "description"),
            facilities: csvField(form, "facilities"),
            food: {
              hasNonVeg: form.get("hasNonVeg") === "on",
              hasVeg: form.get("hasVeg") === "on",
              mealsPerDay: numberField(form, "mealsPerDay"),
              notes: optionalField(form, "foodNotes"),
            },
            hostelType: field(form, "hostelType"),
            location: {
              address: optionalField(form, "address"),
              area: field(form, "area"),
              city: field(form, "city"),
            },
            name: field(form, "name"),
            pricing: {
              monthlyRentMax: numberField(form, "monthlyRentMax"),
              monthlyRentMin: numberField(form, "monthlyRentMin"),
            },
            roomTypes: csvField(form, "roomTypes"),
            rules: csvField(form, "rules"),
          }),
          method: "PATCH",
        });
        setMessage("Profile saved.");
        await load();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Could not save profile.");
      }
    },
    [load],
  );

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <PageHeader
        description="Real hostel listing fields stored in MongoDB and shown publicly after approval."
        icon={Home}
        title="Hostel Profile"
      />
      <Message value={message} />
      {hostel ? (
        <Panel title="Profile Details">
          {hostel.isDemoData ? (
            <div className="mb-4">
              <DemoDataBadge label={hostel.demoDataLabel} />
            </div>
          ) : null}
          <form className="grid gap-4" key={hostel.id} onSubmit={save}>
            <div className="grid gap-4 md:grid-cols-2">
              <Input defaultValue={hostel.name} label="Name" name="name" required />
              <Select
                defaultValue={hostel.hostelType}
                label="Type"
                name="hostelType"
                required
              >
                {["BOYS", "GIRLS", "CO_LIVING"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
              <Input
                defaultValue={hostel.location.area}
                label="Area"
                name="area"
                required
              />
              <Input
                defaultValue={hostel.location.city}
                label="City"
                name="city"
                required
              />
              <Input
                defaultValue={hostel.location.address}
                label="Address"
                name="address"
              />
              <Input defaultValue={hostel.contact?.phone} label="Phone" name="phone" />
              <Input
                defaultValue={hostel.contact?.email}
                label="Email"
                name="email"
                type="email"
              />
              <Input
                defaultValue={hostel.roomTypes.join(", ")}
                label="Room types (comma separated)"
                name="roomTypes"
              />
              <Input
                defaultValue={hostel.facilities.join(", ")}
                label="Facilities (comma separated)"
                name="facilities"
              />
              <Input
                defaultValue={hostel.rules.join(", ")}
                label="Rules (comma separated)"
                name="rules"
              />
              <Input
                defaultValue={hostel.pricing?.monthlyRentMin}
                label="Monthly rent min"
                name="monthlyRentMin"
                type="number"
              />
              <Input
                defaultValue={hostel.pricing?.monthlyRentMax}
                label="Monthly rent max"
                name="monthlyRentMax"
                type="number"
              />
              <Input
                defaultValue={hostel.food?.mealsPerDay}
                label="Meals per day"
                name="mealsPerDay"
                type="number"
              />
            </div>
            <TextArea
              defaultValue={hostel.description}
              label="Description"
              name="description"
            />
            <TextArea
              defaultValue={hostel.food?.notes}
              label="Food notes"
              name="foodNotes"
            />
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  defaultChecked={hostel.food?.hasVeg ?? true}
                  name="hasVeg"
                  type="checkbox"
                />
                Veg
              </label>
              <label className="flex items-center gap-2">
                <input
                  defaultChecked={hostel.food?.hasNonVeg ?? true}
                  name="hasNonVeg"
                  type="checkbox"
                />
                Non-veg
              </label>
            </div>
            <button className="h-11 rounded-md bg-role-admin text-sm font-semibold text-white">
              Save Profile
            </button>
          </form>
        </Panel>
      ) : (
        <EmptyState label="Profile is not loaded." />
      )}
    </div>
  );
});
