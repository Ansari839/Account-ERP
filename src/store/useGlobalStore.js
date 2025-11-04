import { create } from "zustand";

export const useGlobalStore = create((set) => ({
  user: null,
  role: null,
  sidebarOpen: true,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  logout: () => set({ user: null, role: null }),
}));
