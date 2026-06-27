"use client";

import {
  Building2,
  Check,
  CheckCircle2,
  FileCheck2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

import { browserApi } from "@/lib/browser-api";
import { cn } from "@/lib/utils";

import { PublicShell, SectionCard, formatMoney } from "./shared";

type RoomConfig = {
  bedsPerRoom: string;
  id: string;
  mealInclusion: "Included" | "Not Included" | "Optional";
  monthlyRent: string;
  rooms: string;
  roomType: string;
  vacantBeds: string;
};

type DocumentConfig = {
  documentType: string;
  fileUrl: string;
  id: string;
};

const facilityOptions = [
  "Wi-Fi",
  "Study Room",
  "CCTV Security",
  "Hot Water",
  "Laundry",
  "Meals Included",
  "Parking",
  "Power Backup",
  "RO Water",
  "Housekeeping",
  "First Aid",
  "Visitor Lounge",
];

const plans = [
  {
    capacity: "Up to 100 residents",
    id: "starter",
    name: "Starter Plan",
    price: 2900,
  },
  {
    capacity: "Up to 500 residents",
    id: "growth",
    name: "Growth Plan",
    price: 5900,
  },
  {
    capacity: "Unlimited branches & beds",
    id: "enterprise",
    name: "Enterprise Plan",
    price: 11900,
  },
];

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function numberValue(value: string) {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function createRoom(): RoomConfig {
  return {
    bedsPerRoom: "",
    id: crypto.randomUUID(),
    mealInclusion: "Included",
    monthlyRent: "",
    rooms: "",
    roomType: "",
    vacantBeds: "",
  };
}

function createDocument(documentType = ""): DocumentConfig {
  return {
    documentType,
    fileUrl: "",
    id: crypto.randomUUID(),
  };
}

export function PublicHostelRegistrationPage() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(plans[1].id);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [hostelName, setHostelName] = useState("");
  const [hostelType, setHostelType] = useState<"BOYS" | "CO_LIVING" | "GIRLS">(
    "CO_LIVING",
  );
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Kathmandu");
  const [province, setProvince] = useState("Bagmati");
  const [facilities, setFacilities] = useState<string[]>([
    "Wi-Fi",
    "CCTV Security",
    "Hot Water",
    "Meals Included",
  ]);
  const [rules, setRules] = useState("");
  const [rooms, setRooms] = useState<RoomConfig[]>([createRoom()]);
  const [admissionFee, setAdmissionFee] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("3");
  const [hasVeg, setHasVeg] = useState(true);
  const [hasNonVeg, setHasNonVeg] = useState(true);
  const [foodNotes, setFoodNotes] = useState("");
  const [photoUrls, setPhotoUrls] = useState("");
  const [documents, setDocuments] = useState<DocumentConfig[]>([
    createDocument("Ownership proof"),
    createDocument("Business registration"),
  ]);

  const selectedPlanDetail = plans.find((plan) => plan.id === selectedPlan) ?? plans[1];

  const capacitySummary = useMemo(() => {
    return rooms.reduce(
      (summary, room) => {
        const roomCount = numberValue(room.rooms) ?? 0;
        const bedsPerRoom = numberValue(room.bedsPerRoom) ?? 0;
        const vacantBeds = numberValue(room.vacantBeds) ?? 0;

        return {
          totalBeds: summary.totalBeds + roomCount * bedsPerRoom,
          totalRooms: summary.totalRooms + roomCount,
          vacantBeds: summary.vacantBeds + vacantBeds,
        };
      },
      { totalBeds: 0, totalRooms: 0, vacantBeds: 0 },
    );
  }, [rooms]);

  const rentValues = rooms
    .map((room) => numberValue(room.monthlyRent))
    .filter((value): value is number => typeof value === "number");

  const stepsList = [
    { key: 1, label: "Package" },
    { key: 2, label: "Basic Info" },
    { key: 3, label: "Location" },
    { key: 4, label: "Rooms" },
    { key: 5, label: "Documents" },
    { key: 6, label: "Review" },
  ];

  function toggleFacility(facility: string) {
    setFacilities((current) =>
      current.includes(facility)
        ? current.filter((item) => item !== facility)
        : [...current, facility],
    );
  }

  function updateRoom(id: string, next: Partial<RoomConfig>) {
    setRooms((current) =>
      current.map((room) => (room.id === id ? { ...room, ...next } : room)),
    );
  }

  function updateDocument(id: string, next: Partial<DocumentConfig>) {
    setDocuments((current) =>
      current.map((document) =>
        document.id === id ? { ...document, ...next } : document,
      ),
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const roomConfigurations = rooms
      .filter((room) => room.roomType.trim())
      .map((room) => ({
        bedsPerRoom: numberValue(room.bedsPerRoom) ?? 0,
        mealInclusion: room.mealInclusion,
        monthlyRent: numberValue(room.monthlyRent),
        rooms: numberValue(room.rooms) ?? 0,
        roomType: room.roomType.trim(),
        vacantBeds: numberValue(room.vacantBeds) ?? 0,
      }));

    try {
      await browserApi("/api/v1/public/hostels/register", {
        body: JSON.stringify({
          applicant: {
            email: email.trim() || undefined,
            name: ownerName.trim(),
            phone: phone.trim(),
          },
          capacitySummary,
          contact: {
            email: email.trim() || undefined,
            phone: phone.trim(),
          },
          description: description.trim() || undefined,
          documents: documents
            .filter((document) => document.documentType.trim() && document.fileUrl.trim())
            .map((document) => ({
              documentType: document.documentType.trim(),
              fileUrl: document.fileUrl.trim(),
            })),
          facilities,
          food: {
            hasNonVeg,
            hasVeg,
            mealsPerDay: numberValue(mealsPerDay),
            notes: foodNotes.trim() || undefined,
          },
          hostelType,
          location: {
            address: address.trim() || undefined,
            area: area.trim(),
            city: city.trim(),
            province: province.trim() || undefined,
          },
          name: hostelName.trim(),
          notes: `Selected plan: ${selectedPlanDetail.name}`,
          photos: splitLines(photoUrls).map((url) => ({
            alt: hostelName.trim(),
            url,
          })),
          pricing: {
            admissionFee: numberValue(admissionFee),
            currency: "NPR",
            monthlyRentMax: rentValues.length > 0 ? Math.max(...rentValues) : undefined,
            monthlyRentMin: rentValues.length > 0 ? Math.min(...rentValues) : undefined,
          },
          roomConfigurations,
          roomTypes: roomConfigurations.map((room) => room.roomType),
          rules: splitLines(rules),
          selectedPlan,
        }),
        method: "POST",
      });

      setSubmitted(true);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not submit hostel application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PublicShell active="pricing">
      <form className="mx-auto max-w-[1360px] px-6 py-8" onSubmit={submit}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Register New Hostel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit a production-ready hostel listing for platform review.
          </p>
        </div>

        <div className="mx-auto mb-8 flex max-w-4xl items-center justify-between overflow-x-auto rounded-xl border border-border bg-surface p-4 shadow-sm">
          {stepsList.map((item, index) => {
            const isCompleted = step > item.key || submitted;
            const isActive = step === item.key && !submitted;

            return (
              <div className="flex flex-1 items-center last:flex-initial" key={item.key}>
                <div className="flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200",
                      isCompleted
                        ? "bg-success text-white"
                        : isActive
                          ? "bg-brand-teal text-white"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {isCompleted ? <Check className="size-4" /> : item.key}
                  </span>
                  <p className="mt-2 whitespace-nowrap text-[10px] font-semibold text-muted-foreground">
                    {item.label}
                  </p>
                </div>
                {index < stepsList.length - 1 ? (
                  <div className="mx-3 h-0.5 min-w-5 flex-1 bg-border" />
                ) : null}
              </div>
            );
          })}
        </div>

        {message ? (
          <div className="mb-5 rounded-lg border border-danger/25 bg-red-50 p-3 text-sm text-danger">
            {message}
          </div>
        ) : null}

        {submitted ? (
          <div className="mx-auto max-w-xl space-y-5 rounded-xl border border-border bg-surface p-10 text-center shadow">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-success">
              <CheckCircle2 className="size-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Application Submitted</h2>
              <p className="text-sm text-muted-foreground">
                Your hostel listing, owner contact, room configuration, pricing, and
                verification documents were saved for platform review.
              </p>
            </div>
            <Link
              className="inline-flex rounded-lg bg-brand-teal px-6 py-2.5 text-xs font-semibold text-white shadow transition hover:brightness-105"
              href="/"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="grid max-w-[1360px] gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-5">
              {step === 1 ? (
                <SectionCard
                  description="Select the billing plan for this property listing."
                  title="Step 1 of 6: Package"
                >
                  <div className="grid gap-3 md:grid-cols-3">
                    {plans.map((plan) => (
                      <button
                        className={cn(
                          "rounded-xl border p-4 text-left transition",
                          selectedPlan === plan.id
                            ? "border-brand-teal bg-brand-teal/5"
                            : "border-border bg-surface hover:bg-slate-50",
                        )}
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        type="button"
                      >
                        <p className="text-sm font-bold text-primary">{plan.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {plan.capacity}
                        </p>
                        <p className="mt-4 text-sm font-extrabold text-brand-teal">
                          {formatMoney(plan.price)} / mo
                        </p>
                      </button>
                    ))}
                  </div>
                </SectionCard>
              ) : null}

              {step === 2 ? (
                <SectionCard
                  description="These fields become the owner contact and draft hostel record."
                  title="Step 2 of 6: Basic Information"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Hostel Name
                      <input
                        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                        onChange={(event) => setHostelName(event.target.value)}
                        required
                        value={hostelName}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Hostel Type
                      <select
                        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                        onChange={(event) =>
                          setHostelType(event.target.value as typeof hostelType)
                        }
                        value={hostelType}
                      >
                        <option value="BOYS">Boys Hostel</option>
                        <option value="GIRLS">Girls Hostel</option>
                        <option value="CO_LIVING">Co-living</option>
                      </select>
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Owner Full Name
                      <input
                        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                        onChange={(event) => setOwnerName(event.target.value)}
                        required
                        value={ownerName}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Contact Phone
                      <input
                        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                        onChange={(event) => setPhone(event.target.value)}
                        required
                        type="tel"
                        value={phone}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Email Address
                      <input
                        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        value={email}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-primary md:col-span-2">
                      Description
                      <textarea
                        className="min-h-28 rounded-lg border border-border bg-surface p-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                        maxLength={2000}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                        value={description}
                      />
                    </label>
                  </div>
                </SectionCard>
              ) : null}

              {step === 3 ? (
                <SectionCard
                  description="Location and amenities are used by browse, detail, and compare screens."
                  title="Step 3 of 6: Location & Facilities"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Area
                      <input
                        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                        onChange={(event) => setArea(event.target.value)}
                        required
                        value={area}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      City
                      <input
                        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                        onChange={(event) => setCity(event.target.value)}
                        required
                        value={city}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Province
                      <input
                        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                        onChange={(event) => setProvince(event.target.value)}
                        value={province}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Address
                      <input
                        className="h-12 rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                        onChange={(event) => setAddress(event.target.value)}
                        value={address}
                      />
                    </label>
                  </div>
                  <div className="mt-5">
                    <p className="mb-3 text-sm font-semibold text-primary">
                      Hostel Facilities
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {facilityOptions.map((facility) => (
                        <label
                          className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface p-3 text-xs font-semibold"
                          key={facility}
                        >
                          <input
                            checked={facilities.includes(facility)}
                            className="size-4 rounded text-brand-teal"
                            onChange={() => toggleFacility(facility)}
                            type="checkbox"
                          />
                          <span>{facility}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <label className="mt-5 grid gap-2 text-sm font-semibold text-primary">
                    Rules
                    <textarea
                      className="min-h-24 rounded-lg border border-border bg-surface p-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                      onChange={(event) => setRules(event.target.value)}
                      placeholder="One rule per line or comma separated"
                      value={rules}
                    />
                  </label>
                </SectionCard>
              ) : null}

              {step === 4 ? (
                <SectionCard
                  description="Room configuration powers capacity, pricing, and public room cards."
                  title="Step 4 of 6: Rooms, Pricing & Food"
                >
                  <div className="space-y-3">
                    {rooms.map((room) => (
                      <div
                        className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-6"
                        key={room.id}
                      >
                        <input
                          className="h-10 rounded-md border border-border px-3 text-sm md:col-span-2"
                          onChange={(event) =>
                            updateRoom(room.id, { roomType: event.target.value })
                          }
                          placeholder="Room type"
                          required
                          value={room.roomType}
                        />
                        <input
                          className="h-10 rounded-md border border-border px-3 text-sm"
                          min={0}
                          onChange={(event) =>
                            updateRoom(room.id, { rooms: event.target.value })
                          }
                          placeholder="Rooms"
                          required
                          type="number"
                          value={room.rooms}
                        />
                        <input
                          className="h-10 rounded-md border border-border px-3 text-sm"
                          min={0}
                          onChange={(event) =>
                            updateRoom(room.id, { bedsPerRoom: event.target.value })
                          }
                          placeholder="Beds"
                          required
                          type="number"
                          value={room.bedsPerRoom}
                        />
                        <input
                          className="h-10 rounded-md border border-border px-3 text-sm"
                          min={0}
                          onChange={(event) =>
                            updateRoom(room.id, { monthlyRent: event.target.value })
                          }
                          placeholder="Rent"
                          required
                          type="number"
                          value={room.monthlyRent}
                        />
                        <button
                          className="inline-flex h-10 items-center justify-center rounded-md border border-border text-muted-foreground"
                          disabled={rooms.length === 1}
                          onClick={() =>
                            setRooms((current) =>
                              current.filter((item) => item.id !== room.id),
                            )
                          }
                          type="button"
                        >
                          <Trash2 className="size-4" />
                        </button>
                        <input
                          className="h-10 rounded-md border border-border px-3 text-sm"
                          min={0}
                          onChange={(event) =>
                            updateRoom(room.id, { vacantBeds: event.target.value })
                          }
                          placeholder="Vacant beds"
                          type="number"
                          value={room.vacantBeds}
                        />
                        <select
                          className="h-10 rounded-md border border-border px-3 text-sm md:col-span-2"
                          onChange={(event) =>
                            updateRoom(room.id, {
                              mealInclusion: event.target
                                .value as RoomConfig["mealInclusion"],
                            })
                          }
                          value={room.mealInclusion}
                        >
                          <option>Included</option>
                          <option>Optional</option>
                          <option>Not Included</option>
                        </select>
                      </div>
                    ))}
                    <button
                      className="inline-flex items-center gap-2 rounded-md border border-brand-teal px-3 py-2 text-sm font-semibold text-brand-teal"
                      onClick={() => setRooms((current) => [...current, createRoom()])}
                      type="button"
                    >
                      <Plus className="size-4" />
                      Add Room Type
                    </button>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Admission Fee
                      <input
                        className="h-11 rounded-md border border-border px-3 text-sm font-normal"
                        min={0}
                        onChange={(event) => setAdmissionFee(event.target.value)}
                        type="number"
                        value={admissionFee}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Meals Per Day
                      <input
                        className="h-11 rounded-md border border-border px-3 text-sm font-normal"
                        min={0}
                        onChange={(event) => setMealsPerDay(event.target.value)}
                        type="number"
                        value={mealsPerDay}
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold text-primary">
                      Food Notes
                      <input
                        className="h-11 rounded-md border border-border px-3 text-sm font-normal"
                        onChange={(event) => setFoodNotes(event.target.value)}
                        value={foodNotes}
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        checked={hasVeg}
                        onChange={(event) => setHasVeg(event.target.checked)}
                        type="checkbox"
                      />
                      Veg meals
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        checked={hasNonVeg}
                        onChange={(event) => setHasNonVeg(event.target.checked)}
                        type="checkbox"
                      />
                      Non-veg meals
                    </label>
                  </div>
                </SectionCard>
              ) : null}

              {step === 5 ? (
                <SectionCard
                  description="Store public URLs for documents/photos until file upload is connected."
                  title="Step 5 of 6: Documents & Media"
                >
                  <label className="grid gap-2 text-sm font-semibold text-primary">
                    Photo URLs
                    <textarea
                      className="min-h-24 rounded-lg border border-border bg-surface p-3 text-sm font-normal outline-none transition focus:border-brand-teal"
                      onChange={(event) => setPhotoUrls(event.target.value)}
                      placeholder="One image URL per line"
                      value={photoUrls}
                    />
                  </label>
                  <div className="mt-5 space-y-3">
                    {documents.map((document) => (
                      <div
                        className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-[220px_1fr_44px]"
                        key={document.id}
                      >
                        <input
                          className="h-10 rounded-md border border-border px-3 text-sm"
                          onChange={(event) =>
                            updateDocument(document.id, {
                              documentType: event.target.value,
                            })
                          }
                          placeholder="Document type"
                          value={document.documentType}
                        />
                        <input
                          className="h-10 rounded-md border border-border px-3 text-sm"
                          onChange={(event) =>
                            updateDocument(document.id, { fileUrl: event.target.value })
                          }
                          placeholder="https://..."
                          type="url"
                          value={document.fileUrl}
                        />
                        <button
                          className="inline-flex h-10 items-center justify-center rounded-md border border-border text-muted-foreground"
                          disabled={documents.length === 1}
                          onClick={() =>
                            setDocuments((current) =>
                              current.filter((item) => item.id !== document.id),
                            )
                          }
                          type="button"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      className="inline-flex items-center gap-2 rounded-md border border-brand-teal px-3 py-2 text-sm font-semibold text-brand-teal"
                      onClick={() =>
                        setDocuments((current) => [...current, createDocument()])
                      }
                      type="button"
                    >
                      <Upload className="size-4" />
                      Add Document
                    </button>
                  </div>
                </SectionCard>
              ) : null}

              {step === 6 ? (
                <SectionCard
                  description="Submit this application to create pending DB records."
                  title="Step 6 of 6: Review"
                >
                  <div className="grid gap-3 text-sm text-primary md:grid-cols-2">
                    <p>
                      <span className="font-semibold">Hostel:</span> {hostelName || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Owner:</span> {ownerName || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {[area, city].filter(Boolean).join(", ") || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Capacity:</span>{" "}
                      {capacitySummary.totalBeds} beds / {capacitySummary.totalRooms}{" "}
                      rooms
                    </p>
                    <p>
                      <span className="font-semibold">Facilities:</span>{" "}
                      {facilities.length}
                    </p>
                    <p>
                      <span className="font-semibold">Documents:</span>{" "}
                      {
                        documents.filter(
                          (document) => document.documentType && document.fileUrl,
                        ).length
                      }
                    </p>
                  </div>
                  <button
                    className="mt-6 h-12 w-full rounded-lg bg-brand-teal text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </SectionCard>
              ) : null}
            </div>

            <aside className="space-y-5">
              <SectionCard
                description="Your application will stay pending until the platform approves it."
                title="Application Summary"
              >
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Selected Plan</span>
                    <span className="font-semibold text-primary">
                      {selectedPlanDetail.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monthly Fee</span>
                    <span className="font-semibold text-brand-teal">
                      {formatMoney(selectedPlanDetail.price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Beds</span>
                    <span className="font-semibold text-primary">
                      {capacitySummary.totalBeds}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vacancy</span>
                    <span className="font-semibold text-primary">
                      {capacitySummary.vacantBeds}
                    </span>
                  </div>
                </div>
              </SectionCard>
              <SectionCard title="Stored After Submit">
                <div className="space-y-3 text-sm text-muted-foreground">
                  {[
                    [Building2, "Hostel draft with public listing fields"],
                    [FileCheck2, "Pending application and verification record"],
                    [Upload, "Document URL records for platform review"],
                  ].map(([Icon, label]) => (
                    <div className="flex items-center gap-3" key={label as string}>
                      <span className="rounded-lg bg-brand-teal-soft p-2 text-brand-teal">
                        <Icon className="size-4" />
                      </span>
                      <span>{label as string}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </aside>
          </div>
        )}

        {!submitted ? (
          <div className="mt-6 flex items-center justify-between">
            <button
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-primary disabled:opacity-40"
              disabled={step === 1 || isSubmitting}
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              type="button"
            >
              Back
            </button>
            {step < 6 ? (
              <button
                className="rounded-lg bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                onClick={() => setStep((current) => Math.min(6, current + 1))}
                type="button"
              >
                Continue
              </button>
            ) : null}
          </div>
        ) : null}
      </form>
    </PublicShell>
  );
}
