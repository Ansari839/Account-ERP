import { create } from 'zustand';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await getProducts();
      set({ products, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
  addProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      const newProduct = await createProduct(product);
      set((state) => ({
        products: [newProduct, ...state.products],
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  editProduct: async (id, product) => {
    set({ loading: true, error: null });
    try {
      const updatedProduct = await updateProduct(id, product);
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? updatedProduct : p
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
  removeProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteProduct(id);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));

export default useProductStore;