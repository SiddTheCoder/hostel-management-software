"use client";

import {
  ArrowRight,
  Building2,
  Check,
  Image,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent } from "react";

import { browserApi } from "@/lib/browser-api";
import { cn } from "@/lib/utils";

import { PublicShell, formatMoney } from "./shared";

type RoomConfig = {
  attachedBathroom: boolean;
  balcony: boolean;
  bedsPerRoom: string;
  floorNumber: string;
  id: string;
  monthlyRent: string;
  roomSize: string;
  rooms: string;
  roomType: string;
  vacantBeds: string;
};

type UploadedFile = {
  id: string;
  name: string;
  url: string;
  uploading: boolean;
};

const facilityOptions = [
  "Wi-Fi", "Study Room", "CCTV Security", "Hot Water", "Laundry",
  "Meals Included", "Parking", "Power Backup", "RO Water",
  "Housekeeping", "First Aid", "Visitor Lounge", "Garden",
  "AC Rooms", "Generator",
];

const plans = [
  { capacity: "Up to 100 residents", id: "starter", name: "Starter Plan", price: 2900 },
  { capacity: "Up to 500 residents", id: "growth", name: "Growth Plan", price: 5900 },
  { capacity: "Unlimited branches & beds", id: "enterprise", name: "Enterprise Plan", price: 11900 },
];

const nepaliProvinces = [
  "Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim",
];

const roomTypeOptions = ["1-Seater", "2-Seater", "3-Seater", "4-Seater", "Dormitory"];

function createRoom(floorNumber = "1"): RoomConfig {
  return {
    attachedBathroom: true,
    balcony: false,
    bedsPerRoom: "",
    floorNumber,
    id: crypto.randomUUID(),
    monthlyRent: "",
    roomSize: "",
    rooms: "",
    roomType: "",
    vacantBeds: "",
  };
}

function numberValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function FileUploadArea({
  files,
  onFileSelect,
  onRemove,
  accept = "image/jpeg,image/png,image/webp,application/pdf",
  maxFiles = 1,
  label = "Upload file",
  description = "JPEG, PNG, WebP or PDF up to 10MB",
}: {
  files: UploadedFile[];
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemove: (id: string) => void;
  accept?: string;
  maxFiles?: number;
  label?: string;
  description?: string;
}) {
  const canAdd = files.length < maxFiles;

  return (
    <div className="space-y-3">
      {files.map((f) => (
        <div key={f.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            {f.uploading ? (
              <Loader2 className="size-5 shrink-0 animate-spin text-muted-foreground" />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-teal/10 text-brand-teal">
                {f.name.match(/\.(jpe?g|png|webp)/i) ? <Image className="size-5" /> : <Upload className="size-5" />}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-primary">{f.name}</p>
              {f.uploading ? (
                <p className="text-xs text-muted-foreground">Uploading...</p>
              ) : (
                <p className="truncate text-xs text-muted-foreground">{f.url}</p>
              )}
            </div>
          </div>
          <button
            className="ml-2 shrink-0 rounded-md p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600"
            onClick={() => onRemove(f.id)}
            type="button"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      {canAdd ? (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-4 text-sm text-muted-foreground transition hover:border-brand-teal hover:text-brand-teal">
          <Upload className="size-4" />
          <span>{label}</span>
          <input
            accept={accept}
            className="sr-only"
            hidden
            multiple={maxFiles > 1}
            onChange={onFileSelect}
            type="file"
          />
        </label>
      ) : null}
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export function PublicHostelRegistrationPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(plans[0].id);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [hostelName, setHostelName] = useState("");
  const [hostelType, setHostelType] = useState<"BOYS" | "CO_LIVING" | "GIRLS">("CO_LIVING");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");
  const [totalCapacity, setTotalCapacity] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("3");
  const [hasVeg, setHasVeg] = useState(true);
  const [hasNonVeg, setHasNonVeg] = useState(true);
  const [foodNotes, setFoodNotes] = useState("");

  const [country] = useState("Nepal");
  const [province, setProvince] = useState("Bagmati");
  const [city, setCity] = useState("Kathmandu");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [facilities, setFacilities] = useState<string[]>(["Wi-Fi", "CCTV Security", "Hot Water"]);
  const [rules, setRules] = useState("");

  const [totalFloors, setTotalFloors] = useState("1");
  const [rooms, setRooms] = useState<RoomConfig[]>([createRoom("1")]);
  const [admissionFee, setAdmissionFee] = useState("");

  const [mainPhoto, setMainPhoto] = useState<UploadedFile[]>([]);
  const [additionalPhotos, setAdditionalPhotos] = useState<UploadedFile[]>([]);
  const [ownershipDoc, setOwnershipDoc] = useState<UploadedFile[]>([]);
  const [businessDoc, setBusinessDoc] = useState<UploadedFile[]>([]);
  const [ownerIdDoc, setOwnerIdDoc] = useState<UploadedFile[]>([]);

  const selectedPlanDetail = plans.find((p) => p.id === selectedPlan) ?? plans[0];

  const capacitySummary = useMemo(() => {
    return rooms.reduce(
      (s, r) => ({
        totalBeds: s.totalBeds + (numberValue(r.rooms) ?? 0) * (numberValue(r.bedsPerRoom) ?? 0),
        totalRooms: s.totalRooms + (numberValue(r.rooms) ?? 0),
        vacantBeds: s.vacantBeds + (numberValue(r.vacantBeds) ?? 0),
      }),
      { totalBeds: 0, totalRooms: 0, vacantBeds: 0 },
    );
  }, [rooms]);

  const rentValues = rooms
    .map((r) => numberValue(r.monthlyRent))
    .filter((v): v is number => typeof v === "number");

  const allUploaded = [
    ...mainPhoto, ...additionalPhotos,
    ...ownershipDoc, ...businessDoc, ...ownerIdDoc,
  ];
  const uploadingFiles = allUploaded.filter((f) => f.uploading).length;

  async function uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/v1/public/files/upload", {
      body: formData,
      method: "POST",
    });
    const text = await res.text();
    let payload: { success: boolean; message?: string; data?: { url: string } };
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error(`Server returned non-JSON response (${res.status}). Check that the API server is running.`);
    }
    if (!res.ok || !payload.success) throw new Error(payload.message ?? "Upload failed");
    return payload.data!.url;
  }

  function handleFileSelect(
    setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
    maxFiles = 1,
  ) {
    return async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (!files.length) return;

      for (const file of files) {
        const id = crypto.randomUUID();
        setter((prev) => [...prev, { id, name: file.name, url: "", uploading: true }]);

        try {
          const url = await uploadFile(file);
          setter((prev) => prev.map((f) => (f.id === id ? { ...f, url, uploading: false } : f)));
        } catch {
          setter((prev) => prev.filter((f) => f.id !== id));
        }
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
    };
  }

  const stepsList = [
    { key: 1, label: "Basic Info" },
    { key: 2, label: "Location" },
    { key: 3, label: "Rooms & Floors" },
    { key: 4, label: "Documents" },
    { key: 5, label: "Review & Submit" },
  ];

  function toggleFacility(f: string) {
    setFacilities((prev) => (prev.includes(f) ? prev.filter((i) => i !== f) : [...prev, f]));
  }

  function updateRoom(id: string, next: Partial<RoomConfig>) {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...next } : r)));
  }

  function syncFloors() {
    const currentFloors = Number(totalFloors) || 1;
    if (currentFloors < 1) {
      setTotalFloors("1");
      setRooms([createRoom("1")]);
      return;
    }
    const floorNumbers = rooms.map((r) => r.floorNumber);
    const uniqueFloors = [...new Set(floorNumbers)];
    if (uniqueFloors.length === currentFloors) return;
    const newRooms = [...rooms];
    for (let i = 1; i <= currentFloors; i++) {
      const f = String(i);
      if (!uniqueFloors.includes(f)) {
        newRooms.push(createRoom(f));
      }
    }
    setRooms(newRooms.filter((r) => Number(r.floorNumber) <= currentFloors));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (uploadingFiles > 0) {
      setMessage("Please wait for all uploads to complete.");
      return;
    }
    setIsSubmitting(true);
    setMessage("");

    const mealInclusionValue = numberValue(mealsPerDay) && numberValue(mealsPerDay)! > 0
      ? "Included" as const
      : "Not Included" as const;

    const roomConfigurations = rooms
      .filter((r) => r.roomType.trim())
      .map((r) => ({
        attachedBathroom: r.attachedBathroom,
        balcony: r.balcony,
        bedsPerRoom: numberValue(r.bedsPerRoom) ?? 0,
        floorNumber: r.floorNumber,
        mealInclusion: mealInclusionValue,
        monthlyRent: numberValue(r.monthlyRent),
        roomSize: numberValue(r.roomSize),
        rooms: numberValue(r.rooms) ?? 0,
        roomType: r.roomType.trim(),
        vacantBeds: numberValue(r.vacantBeds) ?? 0,
      }));

    const getUrls = (arr: UploadedFile[]) => arr.filter((f) => f.url).map((f) => f.url);

    try {
      await browserApi("/api/v1/public/hostels/register", {
        body: JSON.stringify({
          applicant: {
            email: email.trim() || undefined,
            name: ownerName.trim(),
            phone: phone.trim(),
          },
          alternatePhone: alternatePhone.trim() || undefined,
          capacitySummary,
          contact: { email: email.trim() || undefined, phone: phone.trim() },
          description: description.trim() || undefined,
          documents: [
            ...(ownershipDoc.some((d) => d.url) ? [{ documentType: "Ownership proof", fileUrl: ownershipDoc[0].url }] : []),
            ...(businessDoc.some((d) => d.url) ? [{ documentType: "Business registration", fileUrl: businessDoc[0].url }] : []),
            ...(ownerIdDoc.some((d) => d.url) ? [{ documentType: "Owner ID proof", fileUrl: ownerIdDoc[0].url }] : []),
          ],
          facilities,
          food: { hasNonVeg, hasVeg, mealsPerDay: numberValue(mealsPerDay), notes: foodNotes.trim() || undefined },
          hostelType,
          landmark: landmark.trim() || undefined,
          location: { address: address.trim() || undefined, area: area.trim(), city: city.trim(), province: province.trim() || undefined, country },
          mapLink: mapLink.trim() || undefined,
          name: hostelName.trim(),
          notes: `Selected plan: ${selectedPlanDetail.name}`,
          photos: [
            ...(mainPhoto.some((p) => p.url) ? [{ alt: `${hostelName.trim()} - Main`, url: mainPhoto[0].url }] : []),
            ...additionalPhotos.filter((p) => p.url).map((p) => ({ alt: hostelName.trim(), url: p.url })),
          ],
          pricing: {
            admissionFee: numberValue(admissionFee),
            currency: "NPR",
            monthlyRentMax: rentValues.length > 0 ? Math.max(...rentValues) : undefined,
            monthlyRentMin: rentValues.length > 0 ? Math.min(...rentValues) : undefined,
          },
          roomConfigurations,
          roomTypes: roomConfigurations.map((r) => r.roomType),
          rules: rules.split(/\r?\n|,/).map((l) => l.trim()).filter(Boolean),
          selectedPlan,
          totalCapacity: numberValue(totalCapacity),
          totalFloors: numberValue(totalFloors),
          yearEstablished: yearEstablished.trim() || undefined,
        }),
        method: "POST",
      });

      setSubmitted(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not submit hostel application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PublicShell active="register-hostel">
      <form className="mx-auto max-w-[1200px] px-4 py-8 md:px-6" onSubmit={submit}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary md:text-3xl">Register Your Hostel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the details below to submit your hostel for platform review.
          </p>
        </div>

        <div className="mx-auto mb-8 flex max-w-3xl items-center justify-between overflow-x-auto rounded-xl border border-border bg-surface p-3 shadow-sm md:p-4">
          {stepsList.map((item, index) => {
            const done = step > item.key || submitted;
            const active = step === item.key && !submitted;
            return (
              <div className="flex flex-1 items-center last:flex-initial" key={item.key}>
                <div className="flex flex-col items-center text-center">
                  <span className={cn(
                    "flex size-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    done ? "bg-success text-white" : active ? "bg-brand-teal text-white" : "bg-muted text-muted-foreground",
                  )}>
                    {done ? <Check className="size-4" /> : item.key}
                  </span>
                  <p className="mt-1.5 whitespace-nowrap text-[10px] font-semibold text-muted-foreground">{item.label}</p>
                </div>
                {index < stepsList.length - 1 ? <div className="mx-2 h-px flex-1 bg-border md:mx-3" /> : null}
              </div>
            );
          })}
        </div>

        {message ? (
          <div className="mb-5 rounded-lg border border-danger/25 bg-red-50 p-3 text-sm text-danger">{message}</div>
        ) : null}

        {submitted ? (
          <div className="mx-auto max-w-xl space-y-6 rounded-xl border border-border bg-surface p-10 text-center shadow">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-success">
              <Check className="size-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Application Submitted</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Your hostel registration has been received. Our team will review your application
                and you will be notified via email and WhatsApp once approved.
              </p>
            </div>
            <Link className="inline-flex rounded-lg bg-brand-teal px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:brightness-105" href="/">
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              {step === 1 ? (
                <section className="app-card">
                  <div className="border-b border-border px-5 py-4">
                    <h2 className="text-lg font-semibold text-primary">Step 1 of 5: Basic Information</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Tell us about your hostel and the owner.</p>
                  </div>
                  <div className="space-y-5 p-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="grid gap-1.5 text-sm font-semibold text-primary">
                        Hostel Name <span className="text-danger">*</span>
                        <input className="input-field" onChange={(e) => setHostelName(e.target.value)} required value={hostelName} />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold text-primary">
                        Hostel Type <span className="text-danger">*</span>
                        <select className="input-field" onChange={(e) => setHostelType(e.target.value as typeof hostelType)} value={hostelType}>
                          <option value="BOYS">Boys Hostel</option>
                          <option value="GIRLS">Girls Hostel</option>
                          <option value="CO_LIVING">Co-living</option>
                        </select>
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold text-primary">
                        Year Established
                        <input className="input-field" max={new Date().getFullYear()} min={1950} onChange={(e) => setYearEstablished(e.target.value)} placeholder="e.g. 2020" type="number" value={yearEstablished} />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold text-primary">
                        Total Resident Capacity
                        <input className="input-field" min={0} onChange={(e) => setTotalCapacity(e.target.value)} placeholder="e.g. 100" type="number" value={totalCapacity} />
                      </label>
                    </div>
                    <label className="grid gap-1.5 text-sm font-semibold text-primary md:col-span-2">
                      Description <span className="text-danger">*</span>
                      <textarea className="input-field min-h-24" maxLength={2000} onChange={(e) => setDescription(e.target.value)} placeholder="Tell prospective residents about your hostel — location highlights, atmosphere, nearby colleges, etc." required value={description} />
                    </label>
                    <div className="border-t border-border pt-5">
                      <h3 className="mb-4 text-sm font-bold text-primary">Owner Contact</h3>
                      <div className="grid gap-5 md:grid-cols-2">
                        <label className="grid gap-1.5 text-sm font-semibold text-primary">
                          Full Name <span className="text-danger">*</span>
                          <input className="input-field" onChange={(e) => setOwnerName(e.target.value)} required value={ownerName} />
                        </label>
                        <label className="grid gap-1.5 text-sm font-semibold text-primary">
                          Phone <span className="text-danger">*</span>
                          <input className="input-field" onChange={(e) => setPhone(e.target.value)} required type="tel" value={phone} />
                        </label>
                        <label className="grid gap-1.5 text-sm font-semibold text-primary">
                          Email
                          <input className="input-field" onChange={(e) => setEmail(e.target.value)} type="email" value={email} />
                        </label>
                        <label className="grid gap-1.5 text-sm font-semibold text-primary">
                          Alternate Phone
                          <input className="input-field" onChange={(e) => setAlternatePhone(e.target.value)} type="tel" value={alternatePhone} />
                        </label>
                      </div>
                    </div>
                    <div className="border-t border-border pt-5">
                      <h3 className="mb-4 text-sm font-bold text-primary">Food Details</h3>
                      <div className="grid gap-5 md:grid-cols-3">
                        <label className="grid gap-1.5 text-sm font-semibold text-primary">
                          Meals Per Day
                          <input className="input-field" min={0} onChange={(e) => setMealsPerDay(e.target.value)} type="number" value={mealsPerDay} />
                        </label>
                        <div className="flex items-end gap-4 pb-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-primary">
                            <input checked={hasVeg} className="size-4 rounded text-brand-teal" onChange={(e) => setHasVeg(e.target.checked)} type="checkbox" /> Veg
                          </label>
                          <label className="flex items-center gap-2 text-sm font-medium text-primary">
                            <input checked={hasNonVeg} className="size-4 rounded text-brand-teal" onChange={(e) => setHasNonVeg(e.target.checked)} type="checkbox" /> Non-Veg
                          </label>
                        </div>
                        <label className="grid gap-1.5 text-sm font-semibold text-primary">
                          Food Notes
                          <input className="input-field" onChange={(e) => setFoodNotes(e.target.value)} placeholder="Any special food notes" value={foodNotes} />
                        </label>
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}

              {step === 2 ? (
                <section className="app-card">
                  <div className="border-b border-border px-5 py-4">
                    <h2 className="text-lg font-semibold text-primary">Step 2 of 5: Location & Facilities</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Where is your hostel located and what do you offer?</p>
                  </div>
                  <div className="space-y-5 p-5">
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="grid gap-1.5 text-sm font-semibold text-primary">
                        Country
                        <input className="input-field bg-muted/40" disabled value={country} />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold text-primary">
                        Province <span className="text-danger">*</span>
                        <select className="input-field" onChange={(e) => setProvince(e.target.value)} value={province}>
                          {nepaliProvinces.map((p) => <option key={p}>{p}</option>)}
                        </select>
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold text-primary">
                        City <span className="text-danger">*</span>
                        <input className="input-field" onChange={(e) => setCity(e.target.value)} required value={city} />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold text-primary">
                        Area / Locality <span className="text-danger">*</span>
                        <input className="input-field" onChange={(e) => setArea(e.target.value)} required value={area} />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold text-primary md:col-span-2">
                        Street Address
                        <input className="input-field" onChange={(e) => setAddress(e.target.value)} value={address} />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold text-primary">
                        Landmark
                        <input className="input-field" onChange={(e) => setLandmark(e.target.value)} placeholder="Near..." value={landmark} />
                      </label>
                      <label className="grid gap-1.5 text-sm font-semibold text-primary">
                        Google Maps Link
                        <input className="input-field" onChange={(e) => setMapLink(e.target.value)} placeholder="https://maps.google.com/..." value={mapLink} />
                      </label>
                    </div>
                    <div className="border-t border-border pt-5">
                      <h3 className="mb-4 text-sm font-bold text-primary">Facilities</h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                        {facilityOptions.map((facility) => (
                          <label key={facility} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 text-xs font-semibold transition hover:border-brand-teal">
                            <input checked={facilities.includes(facility)} className="size-4 rounded text-brand-teal" onChange={() => toggleFacility(facility)} type="checkbox" />
                            {facility}
                          </label>
                        ))}
                      </div>
                    </div>
                    <label className="grid gap-1.5 text-sm font-semibold text-primary">
                      House Rules
                      <textarea className="input-field min-h-20" onChange={(e) => setRules(e.target.value)} placeholder="No smoking, No visitors after 9 PM, etc. (one per line)" value={rules} />
                    </label>
                  </div>
                </section>
              ) : null}

              {step === 3 ? (
                <section className="app-card">
                  <div className="border-b border-border px-5 py-4">
                    <h2 className="text-lg font-semibold text-primary">Step 3 of 5: Rooms & Floors</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Configure your room layout floor by floor.</p>
                  </div>
                  <div className="space-y-5 p-5">
                    <label className="grid max-w-xs gap-1.5 text-sm font-semibold text-primary">
                      Total Floors
                      <input
                        className="input-field"
                        min={1} max={50}
                        onChange={(e) => { setTotalFloors(e.target.value); }}
                        onBlur={syncFloors}
                        type="number"
                        value={totalFloors}
                      />
                    </label>

                    {Array.from({ length: Math.max(1, Number(totalFloors) || 1) }, (_, i) => i + 1).map((floorNum) => {
                      const floorRooms = rooms.filter((r) => r.floorNumber === String(floorNum));
                      const floorTotalBeds = floorRooms.reduce((s, r) => s + (numberValue(r.rooms) ?? 0) * (numberValue(r.bedsPerRoom) ?? 0), 0);
                      const floorTotalRooms = floorRooms.reduce((s, r) => s + (numberValue(r.rooms) ?? 0), 0);

                      return (
                        <div key={floorNum} className="rounded-xl border border-border bg-muted/20 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-primary">
                              <Building2 className="size-4 text-brand-teal" />
                              Floor {floorNum}
                            </h4>
                            <span className="text-xs text-muted-foreground">
                              {floorTotalRooms} rooms · {floorTotalBeds} beds
                            </span>
                          </div>

                          {floorRooms.map((room) => (
                            <div key={room.id} className="mb-3 rounded-lg border border-border bg-surface p-4">
                              <div className="grid gap-3 md:grid-cols-4">
                                <label className="grid gap-1 text-xs font-semibold text-primary">
                                  Room Type
                                  <select className="input-field h-9 text-xs" onChange={(e) => updateRoom(room.id, { roomType: e.target.value })} value={room.roomType}>
                                    <option value="">Select type</option>
                                    {roomTypeOptions.map((t) => <option key={t}>{t}</option>)}
                                    <option value="Custom">Custom</option>
                                  </select>
                                </label>
                                <label className="grid gap-1 text-xs font-semibold text-primary">
                                  Rooms
                                  <input className="input-field h-9 text-xs" min={0} onChange={(e) => updateRoom(room.id, { rooms: e.target.value })} placeholder="Count" type="number" value={room.rooms} />
                                </label>
                                <label className="grid gap-1 text-xs font-semibold text-primary">
                                  Beds per Room
                                  <input className="input-field h-9 text-xs" min={0} onChange={(e) => updateRoom(room.id, { bedsPerRoom: e.target.value })} placeholder="Beds" type="number" value={room.bedsPerRoom} />
                                </label>
                                <label className="grid gap-1 text-xs font-semibold text-primary">
                                  Rent per Bed (NPR)
                                  <input className="input-field h-9 text-xs" min={0} onChange={(e) => updateRoom(room.id, { monthlyRent: e.target.value })} placeholder="Rent" type="number" value={room.monthlyRent} />
                                </label>
                                <label className="grid gap-1 text-xs font-semibold text-primary">
                                  Room Size (sq ft)
                                  <input className="input-field h-9 text-xs" onChange={(e) => updateRoom(room.id, { roomSize: e.target.value })} placeholder="e.g. 150" type="number" value={room.roomSize} />
                                </label>
                                <label className="grid gap-1 text-xs font-semibold text-primary">
                                  Vacant Beds
                                  <input className="input-field h-9 text-xs" min={0} onChange={(e) => updateRoom(room.id, { vacantBeds: e.target.value })} placeholder="0" type="number" value={room.vacantBeds} />
                                </label>
                                <div className="flex items-end gap-3 pb-1">
                                  <label className="flex items-center gap-1.5 text-xs font-medium text-primary">
                                    <input checked={room.attachedBathroom} className="size-3.5 rounded text-brand-teal" onChange={(e) => updateRoom(room.id, { attachedBathroom: e.target.checked })} type="checkbox" />
                                    Bathroom
                                  </label>
                                  <label className="flex items-center gap-1.5 text-xs font-medium text-primary">
                                    <input checked={room.balcony} className="size-3.5 rounded text-brand-teal" onChange={(e) => updateRoom(room.id, { balcony: e.target.checked })} type="checkbox" />
                                    Balcony
                                  </label>
                                </div>
                                <div className="flex items-end pb-1">
                                  <button
                                    className="inline-flex h-9 items-center justify-center rounded-md border border-border px-3 text-xs text-muted-foreground hover:border-red-300 hover:text-red-600"
                                    disabled={rooms.length === 1}
                                    onClick={() => setRooms((prev) => prev.filter((r) => r.id !== room.id))}
                                    type="button"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            className="inline-flex items-center gap-1.5 rounded-md border border-brand-teal px-3 py-1.5 text-xs font-semibold text-brand-teal transition hover:bg-brand-teal/5"
                            onClick={() => setRooms((prev) => [...prev, createRoom(String(floorNum))])}
                            type="button"
                          >
                            <Plus className="size-3.5" /> Add Room Type
                          </button>
                        </div>
                      );
                    })}

                    <div className="border-t border-border pt-5">
                      <label className="grid max-w-xs gap-1.5 text-sm font-semibold text-primary">
                        Admission Fee (NPR)
                        <input className="input-field" min={0} onChange={(e) => setAdmissionFee(e.target.value)} type="number" value={admissionFee} />
                      </label>
                    </div>
                  </div>
                </section>
              ) : null}

              {step === 4 ? (
                <section className="app-card">
                  <div className="border-b border-border px-5 py-4">
                    <h2 className="text-lg font-semibold text-primary">Step 4 of 5: Documents & Photos</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Upload photos and verification documents.</p>
                  </div>
                  <div className="space-y-6 p-5">
                    <div>
                      <h3 className="mb-3 text-sm font-bold text-primary">Main Hostel Photo</h3>
                      <FileUploadArea files={mainPhoto} onFileSelect={handleFileSelect(setMainPhoto, 1)} onRemove={(id) => setMainPhoto((prev) => prev.filter((x) => x.id !== id))} label="Upload main photo" />
                    </div>
                    <div>
                      <h3 className="mb-3 text-sm font-bold text-primary">Additional Photos</h3>
                      <FileUploadArea files={additionalPhotos} onFileSelect={handleFileSelect(setAdditionalPhotos, 5)} onRemove={(id) => setAdditionalPhotos((prev) => prev.filter((x) => x.id !== id))} maxFiles={5} label="Add more photos" />
                    </div>
                    <div className="border-t border-border pt-5">
                      <h3 className="mb-4 text-sm font-bold text-primary">Verification Documents</h3>
                      <div className="space-y-5">
                        <div>
                          <p className="mb-2 text-xs font-semibold text-primary">Ownership / Rental Proof</p>
                          <FileUploadArea files={ownershipDoc} onFileSelect={handleFileSelect(setOwnershipDoc, 1)} onRemove={(id) => setOwnershipDoc((prev) => prev.filter((x) => x.id !== id))} label="Upload ownership or rental agreement" />
                        </div>
                        <div>
                          <p className="mb-2 text-xs font-semibold text-primary">Business Registration</p>
                          <FileUploadArea files={businessDoc} onFileSelect={handleFileSelect(setBusinessDoc, 1)} onRemove={(id) => setBusinessDoc((prev) => prev.filter((x) => x.id !== id))} label="Upload business registration document" />
                        </div>
                        <div>
                          <p className="mb-2 text-xs font-semibold text-primary">Owner ID Proof (Citizenship / Passport)</p>
                          <FileUploadArea files={ownerIdDoc} onFileSelect={handleFileSelect(setOwnerIdDoc, 1)} onRemove={(id) => setOwnerIdDoc((prev) => prev.filter((x) => x.id !== id))} label="Upload owner ID" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ) : null}

              {step === 5 ? (
                <section className="app-card">
                  <div className="border-b border-border px-5 py-4">
                    <h2 className="text-lg font-semibold text-primary">Step 5 of 5: Review & Submit</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Review all information before submitting.</p>
                  </div>
                  <div className="space-y-5 p-5">
                    <div className="rounded-lg border border-border bg-muted/20 p-4">
                      <h3 className="mb-3 text-sm font-bold text-primary">Hostel Details</h3>
                      <div className="grid gap-2 text-sm md:grid-cols-2">
                        <p><span className="text-muted-foreground">Name:</span> <span className="font-medium text-primary">{hostelName || "-"}</span></p>
                        <p><span className="text-muted-foreground">Type:</span> <span className="font-medium text-primary">{{ BOYS: "Boys", GIRLS: "Girls", CO_LIVING: "Co-living" }[hostelType]}</span></p>
                        <p><span className="text-muted-foreground">Established:</span> <span className="font-medium text-primary">{yearEstablished || "-"}</span></p>
                        <p><span className="text-muted-foreground">Capacity:</span> <span className="font-medium text-primary">{totalCapacity || "-"} residents</span></p>
                        <p className="md:col-span-2"><span className="text-muted-foreground">Description:</span> <span className="font-medium text-primary">{description ? `${description.slice(0, 100)}${description.length > 100 ? "..." : ""}` : "-"}</span></p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-4">
                      <h3 className="mb-3 text-sm font-bold text-primary">Location</h3>
                      <p className="text-sm text-primary">{area ? `${area}, ${city}, ${province}, ${country}` : city}</p>
                      {landmark ? <p className="mt-1 text-xs text-muted-foreground">Near: {landmark}</p> : null}
                      <p className="mt-2 text-sm font-medium text-primary">{facilities.length} facilities · {rules.split("\n").filter(Boolean).length} rules</p>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-4">
                      <h3 className="mb-3 text-sm font-bold text-primary">Rooms & Pricing</h3>
                      <p className="text-sm text-primary">{capacitySummary.totalBeds} beds across {capacitySummary.totalRooms} rooms on {totalFloors} floor(s)</p>
                      {rentValues.length > 0 ? (
                        <p className="mt-1 text-sm">
                          <span className="text-muted-foreground">Rent range:</span>{" "}
                          <span className="font-medium text-primary">NPR {Math.min(...rentValues).toLocaleString()} - {Math.max(...rentValues).toLocaleString()} / bed</span>
                        </p>
                      ) : null}
                      {admissionFee ? <p className="text-sm"><span className="text-muted-foreground">Admission fee:</span> <span className="font-medium text-primary">NPR {Number(admissionFee).toLocaleString()}</span></p> : null}
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-4">
                      <h3 className="mb-3 text-sm font-bold text-primary">Documents</h3>
                      <div className="space-y-1 text-sm">
                        <p>Main photo: {mainPhoto.some((p) => p.url) ? <span className="text-success">Uploaded</span> : <span className="text-muted-foreground">Not uploaded</span>}</p>
                        <p>Additional photos: {additionalPhotos.filter((p) => p.url).length}</p>
                        <p>Ownership proof: {ownershipDoc.some((d) => d.url) ? <span className="text-success">Uploaded</span> : <span className="text-muted-foreground">Not uploaded</span>}</p>
                        <p>Business registration: {businessDoc.some((d) => d.url) ? <span className="text-success">Uploaded</span> : <span className="text-muted-foreground">Not uploaded</span>}</p>
                        <p>Owner ID: {ownerIdDoc.some((d) => d.url) ? <span className="text-success">Uploaded</span> : <span className="text-muted-foreground">Not uploaded</span>}</p>
                      </div>
                    </div>

                    <div className="rounded-lg border-2 border-brand-teal/20 bg-brand-teal/5 p-5">
                      <h3 className="mb-4 text-sm font-bold text-primary">Select Your Plan</h3>
                      <div className="grid gap-3 md:grid-cols-3">
                        {plans.map((plan) => (
                          <button
                            key={plan.id}
                            className={cn(
                              "rounded-xl border p-4 text-left transition",
                              selectedPlan === plan.id ? "border-brand-teal bg-brand-teal/10 ring-2 ring-brand-teal/20" : "border-border bg-surface hover:border-brand-teal/50",
                            )}
                            onClick={() => setSelectedPlan(plan.id)}
                            type="button"
                          >
                            <p className="text-sm font-bold text-primary">{plan.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{plan.capacity}</p>
                            <p className="mt-3 text-lg font-extrabold text-brand-teal">{formatMoney(plan.price)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                          </button>
                        ))}
                      </div>

                      <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                        <p className="font-semibold text-amber-900">After approval:</p>
                        <ul className="mt-2 space-y-1.5 text-xs text-amber-800">
                          <li className="flex items-start gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-amber-600" /> You will be notified via email and WhatsApp on the provided contact details.</li>
                          <li className="flex items-start gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-amber-600" /> You get a <strong>3-day free trial</strong> to explore the platform after approval.</li>
                          <li className="flex items-start gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-amber-600" /> Within the 3-day trial period, you need to complete the payment for your selected plan.</li>
                          <li className="flex items-start gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-amber-600" /> After payment, your hostel goes live and all features are unlocked.</li>
                        </ul>
                      </div>
                    </div>

                    <button
                      className="mt-2 h-12 w-full rounded-xl bg-brand-teal text-sm font-bold text-white shadow-lg shadow-brand-teal/20 transition hover:brightness-110 disabled:opacity-50"
                      disabled={isSubmitting || uploadingFiles > 0}
                      type="submit"
                    >
                      {isSubmitting ? "Submitting..." : uploadingFiles > 0 ? "Waiting for uploads..." : "Submit Application"}
                    </button>
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="space-y-4">
              <div className="app-card p-4">
                <h3 className="text-sm font-bold text-primary">Application Summary</h3>
                <div className="mt-4 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Plan</span><span className="font-semibold text-primary">{selectedPlanDetail.name}</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Monthly Fee</span><span className="font-semibold text-brand-teal">{formatMoney(selectedPlanDetail.price)}</span></div>
                  <hr className="border-border" />
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Total Beds</span><span className="font-semibold text-primary">{capacitySummary.totalBeds}</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Total Rooms</span><span className="font-semibold text-primary">{capacitySummary.totalRooms}</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Vacant Beds</span><span className="font-semibold text-primary">{capacitySummary.vacantBeds}</span></div>
                </div>
              </div>

              <div className="app-card p-4">
                <h3 className="text-sm font-bold text-primary">What happens next?</h3>
                <div className="mt-3 space-y-2.5 text-xs text-muted-foreground">
                  <p className="flex items-start gap-2"><span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-[9px] font-bold text-brand-teal">1</span>Platform reviews your application</p>
                  <p className="flex items-start gap-2"><span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-[9px] font-bold text-brand-teal">2</span>You receive notification via email & WhatsApp</p>
                  <p className="flex items-start gap-2"><span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-[9px] font-bold text-brand-teal">3</span>3-day free trial to explore your dashboard</p>
                  <p className="flex items-start gap-2"><span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand-teal/10 text-[9px] font-bold text-brand-teal">4</span>Complete payment to go live</p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {!submitted && step < 5 ? (
          <div className="mx-auto mt-8 flex max-w-3xl items-center justify-between">
            <button
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-muted disabled:opacity-40"
              disabled={step === 1 || isSubmitting}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              type="button"
            >
              Back
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-brand-teal px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
              onClick={() => setStep((s) => Math.min(5, s + 1))}
              type="button"
            >
              Continue <ArrowRight className="size-4" />
            </button>
          </div>
        ) : null}
      </form>
    </PublicShell>
  );
}
