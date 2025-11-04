import { create } from 'zustand';

const useAccountStore = create((set) => ({
  accounts: [],
  fetchAccounts: async () => {
    try {
      const response = await fetch('/api/accounts');
      const result = await response.json();
      if (result.success) {
        set({ accounts: result.data });
      } else {
        console.error("Failed to fetch accounts:", result.error);
        set({ accounts: [] });
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      set({ accounts: [] });
    }
  },
  setAccounts: (accounts) => set({ accounts }),
}));

export default useAccountStore;