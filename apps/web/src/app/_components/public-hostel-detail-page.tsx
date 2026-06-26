"use client";

import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileText,
  Home,
  KeyRound,
  MapPin,
  PhoneCall,
  ShieldCheck,
  Star,
  Users,
  Utensils,
  Wifi,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { hostelListings, imageSet } from "@/lib/hostelhub-data";

import { Breadcrumbs, PublicShell, StatusPill, formatMoney, humanize } from "./shared";

export function PublicHostelDetailPage() {
  const params = useParams<{ slug: string }>();
  const hostel =
    hostelListings.find((item) => item.slug === params.slug) ?? hostelListings[0];

  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const images = [
    hostel.image,
    imageSet.room,
    imageSet.lobby,
    imageSet.exteriorA,
    imageSet.foodA,
  ];

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "rooms", label: "Rooms & Pricing" },
    { id: "facilities", label: "Facilities" },
    { id: "food", label: "Food" },
    { id: "rules", label: "Rules" },
    { id: "reviews", label: `Reviews (${hostel.reviews})` },
    { id: "location", label: "Location" },
  ];

  const quickStats = [
    {
      detail: "/ month",
      icon: KeyRound,
      label: "Starting from",
      value: formatMoney(hostel.price),
    },
    {
      detail: "Rooms",
      icon: BedDouble,
      label: "Vacancy",
      value: hostel.vacancy.toString(),
    },
    {
      detail: `${hostel.reviews} reviews`,
      icon: ShieldCheck,
      label: "Rating",
      value: hostel.rating.toString(),
    },
  ];

  const highlights = [
    { detail: "24/7 CCTV & Security", icon: ShieldCheck, label: "Safe & Secure" },
    { detail: "100 Mbps Internet", icon: Wifi, label: "High-Speed Wi-Fi" },
    { detail: "Quiet Study Areas", icon: FileText, label: "Study Friendly" },
    { detail: "Nutritious & Tasty", icon: Utensils, label: "Hygienic Food" },
    { detail: "24/7 Electricity", icon: Wrench, label: "Power Backup" },
    { detail: "Daily Cleaning", icon: Home, label: "Housekeeping" },
  ];

  const rooms = [
    {
      features: ["Attached Bathroom", "Study Table, Wardrobe"],
      image: imageSet.room,
      rent: hostel.price + 8000,
      seats: 12,
      type: "Single Room",
    },
    {
      features: ["Separate Beds", "Study Table, Wardrobe"],
      image: imageSet.lobby,
      rent: hostel.price + 5300,
      seats: 18,
      type: "Double Sharing",
    },
    {
      features: ["Single Beds", "Study Table, Wardrobe"],
      image: imageSet.exteriorA,
      rent: hostel.price + 3000,
      seats: 20,
      type: "Triple Sharing",
    },
    {
      features: ["Bunk Beds", "Locker, Study Table"],
      image: imageSet.exteriorB,
      rent: Math.max(6500, hostel.price + 500),
      seats: 8,
      type: "Dormitory (4 Sharing)",
    },
  ];

  const facilities = [
    { detail: "High Speed", icon: Wifi, label: "Wi-Fi" },
    { detail: "CCTV & Guards", icon: ShieldCheck, label: "24/7 Security" },
    { detail: "24/7 Electricity", icon: Wrench, label: "Power Backup" },
    { detail: "Solar & Geyser", icon: CheckCircle2, label: "Hot Water" },
    { detail: "Washing Machine", icon: FileText, label: "Laundry" },
    { detail: "Quiet Area", icon: FileText, label: "Study Room" },
    { detail: "TV & Games", icon: Users, label: "Common Room" },
    { detail: "Bike Parking", icon: Building2, label: "Parking" },
  ];

  const foodDetails = [
    "3 Times Meal (Breakfast, Lunch, Dinner)",
    "Hygienic & Nutritious Meals",
    "Weekly Menu Plan",
  ];

  const hostelRules = [
    "Visitors not allowed in rooms",
    "No smoking or alcohol",
    "Maintain silence after 10 PM",
    "Respect hostel property & others",
  ];

  const reviewCounts = [
    { count: Math.round(hostel.reviews * 0.72), stars: 5 },
    { count: Math.round(hostel.reviews * 0.2), stars: 4 },
    { count: Math.round(hostel.reviews * 0.05), stars: 3 },
    { count: Math.max(1, Math.round(hostel.reviews * 0.02)), stars: 2 },
    { count: Math.max(1, Math.round(hostel.reviews * 0.01)), stars: 1 },
  ];

  const hostelFacts = [
    ["Hostel Type", humanize(hostel.type)],
    ["Total Rooms", "58"],
    ["Established", "2019"],
    ["Language", "Nepali, English, Hindi"],
    ["Manager", hostel.owner],
    ["Check-in / Check-out", "12:00 PM / 11:00 AM"],
  ];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Hostels", href: "/hostels" },
    { label: hostel.name },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    document
      .getElementById(`hostel-${tabId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <PublicShell active="browse">
      <Breadcrumbs items={breadcrumbItems} />

      <section className="mx-auto grid max-w-[1440px] gap-5 px-4 pb-3 md:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-3">
          <div className="relative h-[310px] overflow-hidden rounded-lg border border-border bg-slate-900 shadow-sm md:h-[380px]">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-300"
              style={{ backgroundImage: `url("${images[currentImgIdx]}")` }}
            />
            <div className="absolute left-4 top-4">
              <StatusPill className="bg-white text-brand-teal shadow-sm" tone="success">
                <BadgeCheck className="size-3.5" /> Verified Hostel
              </StatusPill>
            </div>

            <button
              aria-label="Previous photo"
              className="absolute left-4 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm transition hover:bg-white"
              onClick={() =>
                setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length)
              }
              type="button"
            >
              <ChevronRight className="size-4 rotate-180" />
            </button>
            <button
              aria-label="Next photo"
              className="absolute right-4 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm transition hover:bg-white"
              onClick={() => setCurrentImgIdx((prev) => (prev + 1) % images.length)}
              type="button"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {images.map((img, idx) => (
              <button
                aria-label={`Show photo ${idx + 1}`}
                className={cn(
                  "relative h-16 overflow-hidden rounded-md border-2 bg-muted transition md:h-20",
                  currentImgIdx === idx
                    ? "border-brand-teal"
                    : "border-transparent opacity-85 hover:opacity-100",
                )}
                key={img}
                onClick={() => setCurrentImgIdx(idx)}
                type="button"
              >
                <span
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url("${img}")` }}
                />
                {idx === images.length - 1 ? (
                  <span className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/65 text-xs font-bold text-white">
                    +18
                    <span className="font-medium">Photos</span>
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <article className="rounded-lg border border-border bg-surface p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-extrabold leading-tight text-primary md:text-4xl">
                {hostel.name}
              </h1>
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="size-4 text-brand-teal" />
                <span>{hostel.address}</span>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                {hostel.description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-lg font-bold text-warning">
              <Star className="size-5 fill-warning text-warning" />
              {hostel.rating}
              <span className="text-sm font-semibold text-muted-foreground">
                ({hostel.reviews})
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-y border-border py-5 sm:grid-cols-3">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  className={cn(
                    "flex items-center gap-3",
                    index > 0 && "sm:border-l sm:border-border sm:pl-5",
                  )}
                  key={stat.label}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-brand-teal/20 bg-brand-teal-soft/45 text-brand-teal">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-base font-extrabold text-primary">
                      {stat.value}{" "}
                      <span className="text-xs font-semibold text-muted-foreground">
                        {stat.detail}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  className="flex items-center gap-3 rounded-md border border-border bg-background/55 px-3 py-3"
                  key={item.label}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-teal-soft/70 text-brand-teal">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-primary">{item.label}</p>
                    <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-brand-teal bg-surface text-sm font-bold text-brand-teal transition hover:bg-brand-teal/5"
              href="tel:9841002300"
            >
              <PhoneCall className="size-4" /> Contact Hostel
            </a>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-teal text-sm font-bold text-white shadow-sm transition hover:brightness-105"
              href={`/inquiry?hostel=${hostel.slug}`}
            >
              Send Inquiry
            </Link>
          </div>
        </article>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <nav className="flex gap-7 overflow-x-auto border-b border-border text-sm font-bold text-muted-foreground">
          {tabs.map((tab) => (
            <button
              className={cn(
                "shrink-0 border-b-2 px-1 py-4 transition",
                activeTab === tab.id
                  ? "border-brand-teal text-brand-teal"
                  : "border-transparent hover:text-primary",
              )}
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <section className="mx-auto grid max-w-[1440px] gap-5 px-4 py-4 md:px-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section
            className="rounded-lg border border-border bg-surface p-4 shadow-sm md:p-5"
            id="hostel-rooms"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold text-primary">Rooms & Pricing</h2>
              <Link
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-teal transition hover:text-primary"
                href={`/inquiry?hostel=${hostel.slug}`}
              >
                View all rooms <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {rooms.map((room) => (
                <article
                  className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
                  key={room.type}
                >
                  <div
                    className="h-28 bg-cover bg-center"
                    style={{ backgroundImage: `url("${room.image}")` }}
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-extrabold text-primary">{room.type}</h3>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground">
                        <Users className="size-3" /> {room.seats}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-extrabold text-primary">
                      {formatMoney(room.rent)}{" "}
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        / month
                      </span>
                    </p>
                    <div className="mt-3 space-y-2 text-xs font-medium text-muted-foreground">
                      {room.features.map((feature) => (
                        <p className="flex items-center gap-2" key={feature}>
                          <CheckCircle2 className="size-3.5 text-brand-teal" />
                          {feature}
                        </p>
                      ))}
                    </div>
                    <Link
                      className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-md border border-brand-teal text-xs font-bold text-brand-teal transition hover:bg-brand-teal hover:text-white"
                      href={`/inquiry?hostel=${hostel.slug}&room=${room.type
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")}`}
                    >
                      Request Info
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            className="rounded-lg border border-border bg-surface p-4 shadow-sm md:p-5"
            id="hostel-facilities"
          >
            <h2 className="mb-4 text-xl font-extrabold text-primary">Facilities</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {facilities.map((facility) => {
                const Icon = facility.icon;
                return (
                  <div className="flex items-center gap-3" key={facility.label}>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-teal-soft/70 text-brand-teal">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="text-xs font-extrabold text-primary">
                        {facility.label}
                      </p>
                      <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">
                        {facility.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-3" id="hostel-overview">
            <article
              className="rounded-lg border border-border bg-surface p-5 shadow-sm"
              id="hostel-food"
            >
              <h2 className="text-lg font-extrabold text-primary">Food Details</h2>
              <div className="mt-4 space-y-3 text-sm font-medium text-muted-foreground">
                {foodDetails.map((detail) => (
                  <p className="flex items-start gap-2" key={detail}>
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-teal" />
                    {detail}
                  </p>
                ))}
              </div>
            </article>

            <article
              className="rounded-lg border border-border bg-surface p-5 shadow-sm"
              id="hostel-rules"
            >
              <h2 className="text-lg font-extrabold text-primary">Hostel Rules</h2>
              <div className="mt-4 space-y-3 text-sm font-medium text-muted-foreground">
                {hostelRules.map((rule) => (
                  <p className="flex items-start gap-2" key={rule}>
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-teal" />
                    {rule}
                  </p>
                ))}
              </div>
            </article>

            <article
              className="rounded-lg border border-border bg-surface p-5 shadow-sm"
              id="hostel-reviews"
            >
              <h2 className="text-lg font-extrabold text-primary">What Students Say</h2>
              <div className="mt-4 grid gap-5 sm:grid-cols-[120px_1fr] lg:grid-cols-1 xl:grid-cols-[120px_1fr]">
                <div>
                  <p className="text-5xl font-extrabold text-primary">{hostel.rating}</p>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star className="size-3.5 fill-warning text-warning" key={star} />
                    ))}
                  </div>
                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    Based on {hostel.reviews} reviews
                  </p>
                </div>
                <div className="space-y-2">
                  {reviewCounts.map((row) => (
                    <div
                      className="grid grid-cols-[28px_1fr_28px] items-center gap-2 text-xs"
                      key={row.stars}
                    >
                      <span className="font-bold text-primary">{row.stars} *</span>
                      <span className="h-2 overflow-hidden rounded-full bg-muted">
                        <span
                          className="block h-full rounded-full bg-brand-teal"
                          style={{
                            width: `${Math.min(
                              100,
                              (row.count / hostel.reviews) * 100,
                            )}%`,
                          }}
                        />
                      </span>
                      <span className="text-right font-semibold text-muted-foreground">
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section
            className="rounded-lg border border-border bg-surface p-5 shadow-sm"
            id="hostel-location"
          >
            <h2 className="text-xl font-extrabold text-primary">Location</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_260px]">
              <div className="flex min-h-44 items-center justify-center rounded-lg border border-dashed border-brand-teal/40 bg-brand-teal-soft/20 text-center">
                <div>
                  <MapPin className="mx-auto size-8 text-brand-teal" />
                  <p className="mt-3 text-sm font-extrabold text-primary">
                    {hostel.address}
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    Near campus, transit, and daily essentials.
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm font-medium text-muted-foreground">
                {[
                  "Campus area access",
                  "Public transport nearby",
                  "Food and pharmacy within walking distance",
                ].map((item) => (
                  <p className="flex items-start gap-2" key={item}>
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-teal" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-border bg-surface p-5 shadow-sm">
            <h2 className="text-xl font-extrabold text-primary">Hostel Information</h2>
            <dl className="mt-4 space-y-4">
              {hostelFacts.map(([label, value]) => (
                <div
                  className="flex items-start justify-between gap-4 text-sm"
                  key={label}
                >
                  <dt className="font-medium text-muted-foreground">{label}</dt>
                  <dd className="text-right font-bold text-primary">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex gap-3 rounded-lg bg-brand-teal-soft/35 p-4">
              <ShieldCheck className="size-8 shrink-0 text-brand-teal" />
              <div>
                <p className="font-extrabold text-brand-teal">Safe, Verified & Trusted</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  This hostel is verified by HostelHub for your safety and security.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-border bg-surface p-5 text-center shadow-sm">
            <h2 className="text-lg font-extrabold text-primary">
              Need More Information?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Our team is here to help you find the perfect stay.
            </p>
            <a
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-brand-teal text-sm font-bold text-brand-teal transition hover:bg-brand-teal/5"
              href="tel:015971234"
            >
              <PhoneCall className="size-4" /> Talk to Support
            </a>
            <p className="mt-5 text-xs font-medium text-muted-foreground">
              Or call us at
            </p>
            <a
              className="mt-2 inline-flex items-center gap-2 text-lg font-extrabold text-primary"
              href="tel:015971234"
            >
              <PhoneCall className="size-5 text-brand-teal" /> 01-5971234
            </a>
          </section>
        </aside>
      </section>
    </PublicShell>
  );
}
