import { create } from 'zustand';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api";

const useProductCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await getCategories();
      set({ categories, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  addCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      const newCategory = await createCategory(category);
      set((state) => ({
        categories: [newCategory, ...state.categories],
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  editCategory: async (id, category) => {
    set({ loading: true, error: null });
    try {
      const updatedCategory = await updateCategory(id, category);
      set((state) => ({
        categories: state.categories.map((c) =>
          c._id === id ? updatedCategory : c
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  removeCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteCategory(id);
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));

export default useProductCategoryStore;