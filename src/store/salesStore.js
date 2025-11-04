import { create } from 'zustand';

const useSalesStore = create((set) => ({
  sales: [],
  selectedSale: null,
  setSales: (sales) => set({ sales }),
  setSelectedSale: (sale) => set({ selectedSale: sale }),
}));

export default useSalesStore;
