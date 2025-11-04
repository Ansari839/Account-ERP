import { create } from 'zustand';

const useShopifyStore = create((set) => ({
  shopifyOrders: [],
  selectedOrder: null,
  setShopifyOrders: (orders) => set({ shopifyOrders: orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}));

export default useShopifyStore;
