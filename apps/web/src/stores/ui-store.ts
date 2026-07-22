import { create } from "zustand";

/**
 * Generic client-side UI state (modal + mobile drawer) per PHASES.md §2
 * "stores for: ... modal state". Consumed e.g. by the listing page's mobile
 * filter drawer.
 */
type UiStore = {
  activeModal: string | null;
  closeModal: () => void;
  mobileFiltersOpen: boolean;
  openModal: (id: string) => void;
  setMobileFiltersOpen: (open: boolean) => void;
};

export const useUiStore = create<UiStore>((set) => ({
  activeModal: null,
  closeModal: () => set({ activeModal: null }),
  mobileFiltersOpen: false,
  openModal: (id) => set({ activeModal: id }),
  setMobileFiltersOpen: (open) => set({ mobileFiltersOpen: open }),
}));
