import { create } from 'zustand';
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "@/lib/api";

const useWarehouseStore = create((set) => ({
  warehouses: [],
  loading: false,
  error: null,
  fetchWarehouses: async () => {
    set({ loading: true, error: null });
    try {
      const warehouses = await getWarehouses();
      set({ warehouses, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  addWarehouse: async (warehouse) => {
    set({ loading: true, error: null });
    try {
      const newWarehouse = await createWarehouse(warehouse);
      set((state) => ({
        warehouses: [newWarehouse, ...state.warehouses],
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  editWarehouse: async (id, warehouse) => {
    set({ loading: true, error: null });
    try {
      const updatedWarehouse = await updateWarehouse(id, warehouse);
      set((state) => ({
        warehouses: state.warehouses.map((w) =>
          w._id === id ? updatedWarehouse : w
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  removeWarehouse: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteWarehouse(id);
      set((state) => ({
        warehouses: state.warehouses.filter((w) => w._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));

export default useWarehouseStore;