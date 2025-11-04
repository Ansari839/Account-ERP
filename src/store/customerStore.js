import { create } from 'zustand';

const useCustomerStore = create((set) => ({
  customers: [],
  selectedCustomer: null,
  setCustomers: (customers) => set({ customers }),
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
}));

export default useCustomerStore;
