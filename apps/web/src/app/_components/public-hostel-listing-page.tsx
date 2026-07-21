"use client";

import {
  AlertCircle as AlertIcon,
  ChevronRight,
  Filter,
  Grid2X2,
  List,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { browserApi } from "@/lib/browser-api";
import { cn } from "@/lib/utils";
import { HostelCard, HostelListCard, NepalBannerGraphic, PublicShell } from "./shared";
import {
  hasFood,
  mapPublicHostelToSummary,
  type PublicHostel,
} from "./public-hostel-data";

type LoadState = "loading" | "ready" | "error";

function hostelTypeQuery(value: string) {
  if (value === "Boys") return "BOYS";
  if (value === "Girls") return "GIRLS";
  if (value === "Co-living") return "CO_LIVING";

  return "";
}

function budgetQuery(value: string) {
  if (value === "Under NPR 8,000") return { maxPrice: "7999" };
  if (value === "NPR 8,000 - 10,000") {
    return { maxPrice: "10000", minPrice: "8000" };
  }
  if (value === "Above NPR 10,000") return { minPrice: "10001" };

  return {};
}

function PublicHostelListingPageContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams ? searchParams.get("search") || "" : "";

  const [query, setQuery] = useState(initialSearch);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedArea, setSelectedArea] = useState<string>("All Areas");
  const [selectedBudget, setSelectedBudget] = useState<string>("Any Budget");
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [selectedRoom, setSelectedRoom] = useState<string>("All Room Types");
  const [selectedFood, setSelectedFood] = useState<string>("Any");
  const [selectedFacilities, setSelectedFacilities] = useState<string>("All Facilities");
  const [sortBy, setSortBy] = useState<string>("Recommended");
  const [hostels, setHostels] = useState<PublicHostel[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadHostels() {
      setLoadState("loading");
      setMessage("");

      try {
        const params = new URLSearchParams();
        const budget = budgetQuery(selectedBudget);
        const type = hostelTypeQuery(selectedType);

        if (query.trim()) params.set("q", query.trim());
        if (selectedArea !== "All Areas") params.set("area", selectedArea);
        if (type) params.set("type", type);
        if (selectedRoom !== "All Room Types") params.set("roomType", selectedRoom);
        if (selectedFacilities !== "All Facilities") {
          params.set("facility", selectedFacilities);
        }
        Object.entries(budget).forEach(([key, value]) => params.set(key, value));

        const data = await browserApi<{ hostels: PublicHostel[] }>(
          `/api/v1/public/hostels${params.size ? `?${params.toString()}` : ""}`,
          { signal: controller.signal },
        );

        setHostels(data.hostels);
        setLoadState("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setMessage(
          error instanceof Error ? error.message : "Could not load published hostels.",
        );
        setLoadState("error");
      }
    }

    const timer = window.setTimeout(() => {
      void loadHostels();
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    query,
    selectedArea,
    selectedBudget,
    selectedFacilities,
    selectedRoom,
    selectedType,
  ]);

  const hostelRows = useMemo(
    () =>
      hostels.map((hostel) => ({
        raw: hostel,
        summary: mapPublicHostelToSummary(hostel),
      })),
    [hostels],
  );

  const filtered = useMemo(() => {
    let result = hostelRows
      .filter(({ raw }) => {
        if (selectedFood !== "Any") {
          const hostelHasFood = hasFood(raw);
          if (selectedFood === "With Food" && !hostelHasFood) return false;
          if (selectedFood === "Without Food" && hostelHasFood) return false;
        }

        return true;
      })
      .map(({ summary }) => summary);

    if (sortBy === "Price: Low to High") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Price: High to Low") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "Rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedFood, hostelRows, sortBy]);

  const areaOptions = useMemo(() => {
    const areas = new Set<string>(["All Areas"]);

    hostels.forEach((hostel) => {
      if (hostel.location.city) areas.add(hostel.location.city);
      if (hostel.location.area) areas.add(hostel.location.area);
    });

    return [...areas];
  }, [hostels]);

  return (
    <PublicShell active="browse">
      {/* Hero Banner Section with Nepal Silhouette Graphic */}
      <section className="relative overflow-hidden border-b border-border bg-brand-teal-soft/20 min-h-[160px] flex items-center">
        <div className="mx-auto w-full max-w-[1448px] px-6 py-8 relative z-10">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
            Discover Places
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mt-1">
            Browse Hostels in Nepal
          </h1>
          <p className="mt-2 text-xs md:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Explore verified hostels across top cities. Compare facilities, prices, and
            availability to find the perfect place for your stay.
          </p>
        </div>
        <NepalBannerGraphic />
      </section>

      <div className="mx-auto max-w-[1448px] px-6 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition font-medium">
            Home
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/60" />
          <span className="text-foreground font-semibold">Hostels</span>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Left Sidebar Filter Column */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="bg-surface rounded-xl border border-border/80 p-5 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Filter className="size-4 text-brand-teal" /> Filters
                </h3>
                <button
                  onClick={() => {
                    setQuery("");
                    setSelectedArea("All Areas");
                    setSelectedBudget("Any Budget");
                    setSelectedType("All Types");
                    setSelectedRoom("All Room Types");
                    setSelectedFood("Any");
                    setSelectedFacilities("All Facilities");
                    setSortBy("Recommended");
                  }}
                  className="text-xs font-bold text-brand-teal hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Search input in sidebar */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Search
                </p>
                <div className="relative flex items-center rounded-lg border border-border bg-muted px-3 py-2 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/15 transition">
                  <Search className="size-4 text-muted-foreground shrink-0" />
                  <input
                    className="ml-2 w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Hostel name or area..."
                    value={query}
                  />
                </div>
              </div>

              {/* Area select list */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Area
                </p>
                <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin pr-1">
                  {areaOptions.map((areaName) => {
                    const active = selectedArea === areaName;
                    return (
                      <button
                        key={areaName}
                        onClick={() => setSelectedArea(areaName)}
                        className={cn(
                          "flex items-center justify-between w-full text-left px-2 py-1.5 rounded-md text-xs font-semibold transition",
                          active
                            ? "bg-brand-teal-soft/30 text-brand-teal"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        <span>{areaName}</span>
                        {areaName !== "All Areas" && (
                          <span className="text-[10px] font-normal text-muted-foreground">
                            (
                            {
                              hostelRows.filter(
                                ({ summary }) =>
                                  summary.area === areaName || summary.city === areaName,
                              ).length
                            }
                            )
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget radio buttons */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Budget (Monthly)
                </p>
                <div className="space-y-2">
                  {[
                    "Any Budget",
                    "Under NPR 8,000",
                    "NPR 8,000 - 10,000",
                    "Above NPR 10,000",
                  ].map((budgetRange) => {
                    const active = selectedBudget === budgetRange;
                    return (
                      <label
                        key={budgetRange}
                        className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-foreground"
                      >
                        <input
                          type="radio"
                          name="budget"
                          checked={active}
                          onChange={() => setSelectedBudget(budgetRange)}
                          className="size-3.5 text-brand-teal border-border focus:ring-brand-teal"
                        />
                        <span>{budgetRange}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Hostel Type */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Hostel Type
                </p>
                <div className="space-y-2">
                  {["All Types", "Boys", "Girls", "Co-living"].map((typeVal) => {
                    const active = selectedType === typeVal;
                    return (
                      <label
                        key={typeVal}
                        className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-foreground"
                      >
                        <input
                          type="radio"
                          name="type"
                          checked={active}
                          onChange={() => setSelectedType(typeVal)}
                          className="size-3.5 text-brand-teal border-border focus:ring-brand-teal"
                        />
                        <span>{typeVal}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Room Type */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Room Type
                </p>
                <div className="space-y-2">
                  {["All Room Types", "Single", "Double", "Triple", "Dormitory"].map(
                    (roomVal) => {
                      const active = selectedRoom === roomVal;
                      return (
                        <label
                          key={roomVal}
                          className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-foreground"
                        >
                          <input
                            type="radio"
                            name="room"
                            checked={active}
                            onChange={() => setSelectedRoom(roomVal)}
                            className="size-3.5 text-brand-teal border-border focus:ring-brand-teal"
                          />
                          <span>{roomVal}</span>
                        </label>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Food Option */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Food Option
                </p>
                <div className="space-y-2">
                  {["Any", "With Food", "Without Food"].map((foodVal) => {
                    const active = selectedFood === foodVal;
                    return (
                      <label
                        key={foodVal}
                        className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-foreground"
                      >
                        <input
                          type="radio"
                          name="food"
                          checked={active}
                          onChange={() => setSelectedFood(foodVal)}
                          className="size-3.5 text-brand-teal border-border focus:ring-brand-teal"
                        />
                        <span>{foodVal}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-2 pt-2 border-t border-border/60">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Facilities
                </p>
                <div className="space-y-2">
                  {[
                    "All Facilities",
                    "Wi-Fi",
                    "Food",
                    "CCTV",
                    "Hot Water",
                    "Laundry",
                    "Study Room",
                  ].map((facVal) => {
                    const active = selectedFacilities === facVal;
                    return (
                      <label
                        key={facVal}
                        className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-foreground"
                      >
                        <input
                          type="radio"
                          name="facilities"
                          checked={active}
                          onChange={() => setSelectedFacilities(facVal)}
                          className="size-3.5 text-brand-teal border-border focus:ring-brand-teal"
                        />
                        <span>{facVal}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Listings Column */}
          <main className="space-y-5">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-surface rounded-xl border border-border/80 p-4 shadow-sm">
              <div className="space-y-0.5">
                <h3 className="font-bold text-sm text-foreground">Showing Hostels</h3>
                <p className="text-[11px] text-muted-foreground font-semibold">
                  {loadState === "loading"
                    ? "Loading published hostels..."
                    : `${filtered.length} verified ${
                        filtered.length === 1 ? "result" : "results"
                      } found in Nepal`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Option */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground shrink-0">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-muted border border-border rounded-lg text-xs font-bold text-foreground py-1.5 px-3 outline-none focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15 transition cursor-pointer"
                  >
                    {[
                      "Recommended",
                      "Price: Low to High",
                      "Price: High to Low",
                      "Rating",
                    ].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Toggles */}
                <div className="flex items-center gap-1.5 border-l border-border/60 pl-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "size-8 rounded-lg flex items-center justify-center border transition",
                      viewMode === "grid"
                        ? "border-brand-teal bg-brand-teal-soft/10 text-brand-teal"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <Grid2X2 className="size-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "size-8 rounded-lg flex items-center justify-center border transition",
                      viewMode === "list"
                        ? "border-brand-teal bg-brand-teal-soft/10 text-brand-teal"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Grid / List */}
            {message ? (
              <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm font-semibold text-danger">
                {message}
              </div>
            ) : null}

            {loadState === "loading" ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    className="h-72 animate-pulse rounded-xl border border-border bg-muted"
                    key={index}
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 rounded-xl border border-dashed border-border bg-muted/50">
                <AlertIcon className="mx-auto size-10 text-muted-foreground" />
                <p className="mt-4 font-bold text-foreground">
                  No results match your filters
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                  Try widening your search criteria, clearing search keywords, or
                  selecting different filter parameters.
                </p>
                <button
                  className="mt-5 rounded-lg bg-brand-teal px-5 py-2.5 text-xs font-bold text-white hover:brightness-105 transition"
                  onClick={() => {
                    setQuery("");
                    setSelectedArea("All Areas");
                    setSelectedBudget("Any Budget");
                    setSelectedType("All Types");
                    setSelectedRoom("All Room Types");
                    setSelectedFood("Any");
                    setSelectedFacilities("All Facilities");
                    setSortBy("Recommended");
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={cn(
                  viewMode === "grid"
                    ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col gap-4",
                )}
              >
                {filtered.map((hostel) =>
                  viewMode === "grid" ? (
                    <HostelCard hostel={hostel} key={hostel.id} />
                  ) : (
                    <HostelListCard hostel={hostel} key={hostel.id} />
                  ),
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </PublicShell>
  );
}

export function PublicHostelListingPage() {
  return (
    <Suspense fallback={null}>
      <PublicHostelListingPageContent />
    </Suspense>
  );
}
