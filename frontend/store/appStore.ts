import { create } from "zustand";

interface AppState {
  activeCandidateId: string | null;
  selectedRole: string;
  sidebarOpen: boolean;
  /** Mobile-only side panels: candidates list or the analyse form. */
  mobilePanel: "candidates" | "analyse" | null;
  setActiveCandidateId: (id: string | null) => void;
  setSelectedRole: (r: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setMobilePanel: (panel: "candidates" | "analyse" | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeCandidateId: null,
  selectedRole: "Software Engineer",
  sidebarOpen: true,
  mobilePanel: "analyse", // phones open straight onto the analyse form
  setActiveCandidateId: (id) => set({ activeCandidateId: id }),
  setSelectedRole: (r) => set({ selectedRole: r }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobilePanel: (panel) => set({ mobilePanel: panel }),
}));
