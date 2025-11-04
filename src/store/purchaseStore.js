import { create } from 'zustand';

const usePurchaseStore = create((set) => ({
  purchases: [],
  selectedPurchase: null,
  setPurchases: (purchases) => set({ purchases }),
  setSelectedPurchase: (purchase) => set({ selectedPurchase: purchase }),
}));

export default usePurchaseStore;
