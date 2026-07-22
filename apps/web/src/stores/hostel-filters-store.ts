import { create } from "zustand";

/**
 * Client UI state for the public hostel listing filters (Zustand — client state
 * layer per ARCHITECTURE.md). Kept separate from server state (TanStack Query).
 */
export type HostelFiltersState = {
  area: string;
  budget: string;
  college: string;
  facilities: string;
  food: string;
  query: string;
  room: string;
  sortBy: string;
  type: string;
  viewMode: "grid" | "list";
};

export const initialHostelFilters: HostelFiltersState = {
  area: "All Areas",
  budget: "Any Budget",
  college: "All Colleges",
  facilities: "All Facilities",
  food: "Any",
  query: "",
  room: "All Room Types",
  sortBy: "Recommended",
  type: "All Types",
  viewMode: "grid",
};

type HostelFiltersStore = HostelFiltersState & {
  reset: () => void;
  update: (patch: Partial<HostelFiltersState>) => void;
};

export const useHostelFiltersStore = create<HostelFiltersStore>((set) => ({
  ...initialHostelFilters,
  reset: () => set(initialHostelFilters),
  update: (patch) => set(patch),
}));
