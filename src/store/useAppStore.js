import { create } from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  isSidebarOpen: false,
  setUser: (user) => set({ user }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useAppStore;
