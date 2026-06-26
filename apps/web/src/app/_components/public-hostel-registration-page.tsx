"use client";

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  AlertCircle,
  AlertCircle as AlertIcon,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Bell,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Grid2X2,
  Heart,
  HelpCircle,
  Home,
  KeyRound,
  List,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  MoreVertical,
  Phone,
  PhoneCall,
  Plus,
  QrCode,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Trash2,
  Upload,
  User,
  UserRound,
  Users,
  Utensils,
  Wifi,
  WalletCards,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  adminMetrics,
  auditActivity,
  complaints,
  imageSet,
  notices,
  payments,
  platformMetrics,
  providers,
  hostelListings,
  residents,
  weeklyMenu,
  type HostelSummary,
  type Tone,
} from "@/lib/hostelhub-data";
import {
  AnimatedPage,
  Breadcrumbs,
  FormField,
  HostelCard,
  HostelListCard,
  MetricCard,
  NepalBannerGraphic,
  PublicShell,
  SectionCard,
  StatusPill,
  TableView,
  formatMoney,
  humanize,
  metricIcons,
  type AuthMode,
  type PortalKind,
} from "./shared";

export function PublicHostelRegistrationPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Registration local state data
  const [hostelName, setHostelName] = useState("");
  const [hostelType, setHostelType] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [capacity, setCapacity] = useState("");
  const [category, setCategory] = useState("boys");
  const [description, setDescription] = useState("");

  const stepsList = [
    { key: 1, label: "Package" },
    { key: 2, label: "Basic Info" },
    { key: 3, label: "Location & Facilities" },
    { key: 4, label: "Rooms & Pricing" },
    { key: 5, label: "Documents" },
    { key: 6, label: "Review" },
  ];

  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <PublicShell active="pricing">
      <section className="mx-auto max-w-[1360px] px-6 py-8">
        {/* Registration Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Register New Hostel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your hostel listing in a few simple steps
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="mb-8 max-w-4xl mx-auto border border-border rounded-xl bg-surface p-4 shadow-sm flex justify-between items-center overflow-x-auto">
          {stepsList.map((st, idx) => {
            const isCompleted = step > st.key || submitted;
            const isActive = step === st.key && !submitted;
            return (
              <div className="flex items-center flex-1 last:flex-initial" key={st.key}>
                <div className="text-center flex flex-col items-center">
                  <span
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200",
                      isCompleted
                        ? "bg-success text-white"
                        : isActive
                          ? "bg-brand-teal text-white"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {isCompleted ? <Check className="size-4" /> : st.key}
                  </span>
                  <p className="mt-2 text-[10px] font-semibold text-muted-foreground whitespace-nowrap">
                    {st.label}
                  </p>
                </div>
                {idx < stepsList.length - 1 && (
                  <div className="h-0.5 flex-1 bg-border mx-3 min-w-[20px]" />
                )}
              </div>
            );
          })}
        </div>

        {submitted ? (
          /* Successful Submission Screen */
          <div className="max-w-xl mx-auto rounded-xl border border-border bg-surface p-10 text-center space-y-5 shadow">
            <div className="size-16 rounded-full bg-emerald-100 text-success flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">You&apos;re All Set!</h2>
              <p className="text-sm text-muted-foreground">
                Your hostel registration application will go for review.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed pt-2">
                Our platform inspection team will verify your uploaded documents,
                ownership proof, room inventory details, and address coordinates. You will
                receive an email or phone update within 1-2 business days once approved
                and published.
              </p>
            </div>
            <div className="pt-4 flex justify-center gap-3">
              <Link
                href="/"
                className="rounded-lg bg-brand-teal px-6 py-2.5 text-xs font-semibold text-white shadow hover:brightness-105 transition"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-step Forms */
          <div className="grid max-w-[1360px] gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            {/* Left Form Block */}
            <div className="space-y-5">
              {step === 1 && (
                <SectionCard
                  title="Step 1 of 5: Select Package"
                  description="Select the platform billing plan for your property listing."
                >
                  <div className="space-y-4 p-1">
                    <p className="text-xs text-muted-foreground">
                      Choose the plan that fits your branch capacity:
                    </p>
                    {[
                      {
                        id: "starter",
                        name: "Starter Plan",
                        price: 2900,
                        capacity: "Up to 100 residents",
                      },
                      {
                        id: "pro",
                        name: "Pro Plan (Most Popular)",
                        price: 5900,
                        capacity: "Up to 500 residents",
                      },
                      {
                        id: "enterprise",
                        name: "Enterprise Plan",
                        price: 11900,
                        capacity: "Unlimited branches & beds",
                      },
                    ].map((plan) => (
                      <div
                        key={plan.id}
                        className="rounded-xl border border-border p-4 bg-surface hover:bg-slate-50/50 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-bold text-primary">{plan.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {plan.capacity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-brand-teal">
                            NPR {plan.price} / mo
                          </p>
                          <span className="text-[10px] text-muted-foreground">
                            Billed monthly
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {step === 2 && (
                <SectionCard
                  title="Step 2 of 5: Basic Information"
                  description="Tell us the basic operational details about your hostel."
                >
                  <div className="space-y-4 p-1">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-semibold text-primary">
                          Hostel Name *
                          <input
                            className="mt-2 flex h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none focus:border-brand-teal transition"
                            onChange={(e) => setHostelName(e.target.value)}
                            placeholder="Enter hostel name"
                            value={hostelName}
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-primary">
                          Hostel Type *
                          <select
                            onChange={(e) => setHostelType(e.target.value)}
                            value={hostelType}
                            className="mt-2 flex h-12 w-full items-center rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none focus:border-brand-teal cursor-pointer text-primary"
                          >
                            <option value="">Select hostel type</option>
                            <option value="Boys Hostel">Boys Hostel</option>
                            <option value="Girls Hostel">Girls Hostel</option>
                            <option value="Co-living / Mixed">Co-living / Mixed</option>
                          </select>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-primary">
                          Owner Full Name *
                          <input
                            className="mt-2 flex h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none focus:border-brand-teal transition"
                            onChange={(e) => setOwnerName(e.target.value)}
                            placeholder="Enter owner full name"
                            value={ownerName}
                            required
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-primary">
                          Contact Phone *
                          <input
                            className="mt-2 flex h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none focus:border-brand-teal transition"
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="98XXXXXXXX"
                            value={phone}
                            required
                            type="tel"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-primary">
                          Email Address *
                          <input
                            className="mt-2 flex h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none focus:border-brand-teal transition"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            value={email}
                            required
                            type="email"
                          />
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-primary">
                          Total Capacity (Beds) *
                          <input
                            className="mt-2 flex h-12 w-full rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none focus:border-brand-teal transition"
                            onChange={(e) => setCapacity(e.target.value)}
                            placeholder="e.g. 50"
                            value={capacity}
                            required
                            type="number"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-primary">
                        Hostel Category *
                      </p>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {["boys", "girls", "co-living"].map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={cn(
                              "border rounded-xl p-4 flex flex-col items-center capitalize gap-2 transition",
                              category === cat
                                ? "border-brand-teal bg-brand-teal/5 text-brand-teal"
                                : "border-border bg-surface",
                            )}
                          >
                            <Building2 className="size-5" />
                            <span className="text-xs font-semibold">{cat}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="block text-sm font-semibold text-primary">
                      Short Description *
                      <textarea
                        maxLength={300}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="mt-2 min-h-24 w-full rounded-lg border border-border bg-surface p-3 text-sm font-normal outline-none focus:border-brand-teal transition"
                        placeholder="Write a short description about your hostel..."
                      />
                      <span className="text-[10px] text-muted-foreground block text-right mt-1">
                        {description.length}/300 characters
                      </span>
                    </label>
                  </div>
                </SectionCard>
              )}

              {step === 3 && (
                <SectionCard
                  title="Step 3 of 5: Location & Facilities"
                  description="Provide the map location coordinates and select hostel amenities."
                >
                  <div className="space-y-5 p-1">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        icon={MapPin}
                        label="Address Line *"
                        placeholder="e.g. Bagdol, Lalitpur"
                      />
                      <div>
                        <label className="block text-sm font-semibold text-primary">
                          City *
                          <select className="mt-2 flex h-12 w-full items-center rounded-lg border border-border bg-surface px-3 text-sm font-normal outline-none focus:border-brand-teal cursor-pointer text-primary">
                            <option>Lalitpur</option>
                            <option>Kathmandu</option>
                            <option>Pokhara</option>
                            <option>Bhaktapur</option>
                          </select>
                        </label>
                      </div>
                    </div>

                    {/* Checkbox facilities list */}
                    <div>
                      <p className="text-sm font-semibold text-primary mb-3">
                        Hostel Facilities
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          "Wi-Fi",
                          "Study Room",
                          "CCTV Security",
                          "Hot Water",
                          "Laundry",
                          "Meals Included",
                          "Parking",
                          "Power Backup",
                          "RO Water",
                        ].map((item) => (
                          <label
                            className="flex items-center gap-2 border border-border rounded-lg p-3 cursor-pointer bg-surface text-xs font-semibold"
                            key={item}
                          >
                            <input
                              defaultChecked
                              className="size-4 rounded text-brand-teal"
                              type="checkbox"
                            />
                            <span>{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>
              )}

              {step === 4 && (
                <SectionCard
                  title="Step 4 of 5: Rooms & Pricing"
                  description="List all available room configurations and prices."
                >
                  <div className="space-y-4 p-1 overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-border text-primary font-bold">
                          <th className="p-3">Room Type</th>
                          <th className="p-3">No. of Rooms</th>
                          <th className="p-3">Beds per Room</th>
                          <th className="p-3">Vacancy</th>
                          <th className="p-3">Monthly Rent (NPR)</th>
                          <th className="p-3">Meal Inclusion</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {[
                          ["Single Room", "10", "1", "3", "9,600", "Included"],
                          ["Double Sharing", "8", "2", "2", "7,500", "Included"],
                          ["Triple Sharing", "6", "3", "1", "6,000", "Optional"],
                          ["Dormitory (6 Beds)", "4", "6", "8", "4,500", "Not Included"],
                        ].map(([type, cnt, beds, vac, rent, meal]) => (
                          <tr key={type} className="hover:bg-slate-50/50">
                            <td className="p-3 font-semibold text-primary">{type}</td>
                            <td className="p-3">
                              <input
                                type="number"
                                defaultValue={cnt}
                                className="w-16 border rounded p-1 text-center"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                defaultValue={beds}
                                className="w-16 border rounded p-1 text-center"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="number"
                                defaultValue={vac}
                                className="w-16 border rounded p-1 text-center"
                              />
                            </td>
                            <td className="p-3">
                              <input
                                type="text"
                                defaultValue={rent}
                                className="w-24 border rounded p-1 text-center"
                              />
                            </td>
                            <td className="p-3">
                              <select
                                defaultValue={meal}
                                className="border rounded p-1 bg-transparent"
                              >
                                <option>Included</option>
                                <option>Optional</option>
                                <option>Not Included</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              )}

              {step === 5 && (
                <SectionCard
                  title="Step 5 of 5: Documents & Verification"
                  description="Upload official documents to qualify your property verification status."
                >
                  <div className="space-y-4 p-1 text-xs">
                    {[
                      {
                        label: "Ownership Proof",
                        desc: "Property deed or purchase certificate",
                        file: "ownership_deed.pdf",
                        status: "uploaded",
                      },
                      {
                        label: "Citizenship ID",
                        desc: "Owner citizenship card front/back",
                        file: "citizenship_front.jpg",
                        status: "uploaded",
                      },
                      {
                        label: "PAN / VAT Document",
                        desc: "Official business registration certificate",
                        file: "pan_card.pdf",
                        status: "uploaded",
                      },
                      {
                        label: "Hostel License / Registration",
                        desc: "Ward or municipal operational license",
                        status: "pending",
                      },
                      {
                        label: "Bank Account Details",
                        desc: "Account statement or canceled cheque copy",
                        status: "pending",
                      },
                    ].map((doc) => (
                      <div
                        className="rounded-xl border border-border p-4 bg-surface flex justify-between items-center gap-4"
                        key={doc.label}
                      >
                        <div>
                          <p className="font-bold text-sm text-primary">{doc.label}</p>
                          <p className="text-muted-foreground mt-0.5">{doc.desc}</p>
                          {doc.file && (
                            <p className="text-[10px] text-brand-teal mt-1 font-semibold">
                              &bull; {doc.file}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 flex items-center gap-3">
                          {doc.status === "uploaded" ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-success">
                              <Check className="size-3 mr-1" /> Uploaded
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => alert(`Upload triggered for ${doc.label}`)}
                              className="rounded-lg border border-slate-300 px-3 py-1.5 font-bold hover:bg-slate-50 transition"
                            >
                              Upload File
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {step === 6 && (
                <SectionCard
                  title="Step 6: Review & Submit"
                  description="Verify all details are correct before sending for admin review."
                >
                  <div className="space-y-4 p-1 text-xs text-muted-foreground">
                    <div className="divide-y divide-border border rounded-xl bg-surface">
                      {[
                        ["Hostel Name", hostelName || "Green View Hostel"],
                        ["Warden Category", category.toUpperCase()],
                        ["Owner Full Name", ownerName || "Aarav Shrestha"],
                        ["Phone Number", phone || "9841002300"],
                        ["Email", email || "owner@example.com"],
                        ["Bed Capacity", `${capacity || "50"} Beds`],
                      ].map(([lbl, val]) => (
                        <div
                          className="p-3.5 flex justify-between items-center"
                          key={lbl}
                        >
                          <span className="font-semibold text-primary">{lbl}</span>
                          <span className="font-medium text-slate-600">{val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-start gap-2.5 p-2">
                      <input
                        required
                        className="size-4 rounded border-border mt-0.5 cursor-pointer"
                        type="checkbox"
                        id="reg-confirm"
                      />
                      <label
                        htmlFor="reg-confirm"
                        className="text-xs leading-relaxed text-muted-foreground cursor-pointer select-none"
                      >
                        I confirm that all the information provided is accurate and
                        complete. I agree to HostelHub&apos;s Terms of Service and Privacy
                        Policy.
                      </label>
                    </div>
                  </div>
                </SectionCard>
              )}

              {/* Back / Next buttons */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handlePrevStep}
                  disabled={step === 1}
                  className="rounded-lg border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &larr; Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="rounded-lg bg-brand-teal px-6 py-2.5 text-xs font-semibold text-white shadow hover:brightness-105 transition"
                >
                  {step === 6 ? "Submit for Approval" : "Continue"} &rarr;
                </button>
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="space-y-5">
              <SectionCard title="Registration Summary">
                <div className="space-y-4 text-xs text-muted-foreground p-1">
                  <p className="rounded-lg bg-brand-teal-soft/40 p-4 text-brand-teal leading-relaxed">
                    Hostel registrations require physical administrative review and verify
                    checkouts. All listing details will remain offline until platform
                    owner checks are complete.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Basic hostel profile details",
                      "Facilities and map location",
                      "Room inventory configuration",
                      "PAN/VAT & municipal license verification",
                      "Photos approval",
                    ].map((item, idx) => (
                      <div className="flex items-center gap-2" key={item}>
                        <span
                          className={cn(
                            "size-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white",
                            step > idx + 1 ? "bg-success" : "bg-slate-300",
                          )}
                        >
                          {step > idx + 1 ? <Check className="size-3" /> : idx + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </SectionCard>

              {/* Selected package highlights */}
              <div className="rounded-xl border border-border bg-surface p-5 space-y-3">
                <p className="font-bold text-xs text-primary">Plan Highlights</p>
                <ul className="text-xs text-muted-foreground space-y-2 border-t border-border/40 pt-3">
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-brand-teal" /> Verified badge on
                    listing
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-brand-teal" /> Operations admin
                    dashboard
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-brand-teal" /> Monthly fee receipt
                    tracking
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-brand-teal" /> Integrated service
                    provider search
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
