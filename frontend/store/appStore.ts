import { create } from "zustand";

interface AppState {
  activeCandidateId: string | null;
  selectedRole: string;
  sidebarOpen: boolean;
  setActiveCandidateId: (id: string | null) => void;
  setSelectedRole: (r: string) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeCandidateId: null,
  selectedRole: "Software Engineer",
  sidebarOpen: true,
  setActiveCandidateId: (id) => set({ activeCandidateId: id }),
  setSelectedRole: (r) => set({ selectedRole: r }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
