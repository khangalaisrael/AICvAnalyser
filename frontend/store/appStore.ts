import { create } from "zustand";

interface AppState {
  activeCandidateId: string | null;
  selectedRole: string;
  sidebarOpen: boolean;
  /** Mobile-only candidates drawer. */
  mobilePanel: "candidates" | null;
  setActiveCandidateId: (id: string | null) => void;
  setSelectedRole: (r: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setMobilePanel: (panel: "candidates" | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeCandidateId: null,
  selectedRole: "Software Engineer",
  sidebarOpen: true,
  mobilePanel: null,
  setActiveCandidateId: (id) => set({ activeCandidateId: id }),
  setSelectedRole: (r) => set({ selectedRole: r }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobilePanel: (panel) => set({ mobilePanel: panel }),
}));
