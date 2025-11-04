import { create } from 'zustand';
import {
  getVariants,
  createVariant,
  updateVariant,
  deleteVariant,
} from "@/lib/api";

const useProductVariantStore = create((set) => ({
  variants: [],
  loading: false,
  error: null,
  fetchVariants: async () => {
    set({ loading: true, error: null });
    try {
      const variants = await getVariants();
      set({ variants, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  addVariant: async (variant) => {
    set({ loading: true, error: null });
    try {
      const newVariant = await createVariant(variant);
      set((state) => ({
        variants: [newVariant, ...state.variants],
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  editVariant: async (id, variant) => {
    set({ loading: true, error: null });
    try {
      const updatedVariant = await updateVariant(id, variant);
      set((state) => ({
        variants: state.variants.map((v) =>
          v._id === id ? updatedVariant : v
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  removeVariant: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteVariant(id);
      set((state) => ({
        variants: state.variants.filter((v) => v._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));

export default useProductVariantStore;
