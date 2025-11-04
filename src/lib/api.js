import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Requesting URL: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`Error: ${error.message}`);
    return Promise.reject(error);
  }
);

export const getCategories = async () => {
  try {
    const response = await api.get("/product-categories");
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createCategory = async (category) => {
  try {
    const response = await api.post("/product-categories", category);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateCategory = async (id, category) => {
  try {
    const response = await api.patch(`/product-categories/${id}`, category);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/product-categories/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWarehouses = async () => {
  try {
    const response = await api.get("/warehouses");
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createWarehouse = async (warehouse) => {
  try {
    const response = await api.post("/warehouses", warehouse);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateWarehouse = async (id, warehouse) => {
  try {
    const response = await api.patch(`/warehouses/${id}`, warehouse);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteWarehouse = async (id) => {
  try {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getVariants = async () => {
  try {
    const response = await api.get("/product-variants");
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createVariant = async (variant) => {
  try {
    const response = await api.post("/product-variants", variant);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateVariant = async (id, variant) => {
  try {
    const response = await api.patch(`/product-variants/${id}`, variant);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteVariant = async (id) => {
  try {
    const response = await api.delete(`/product-variants/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createProduct = async (product) => {
  try {
    const response = await api.post("/products", product);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProduct = async (id, product) => {
  try {
    const response = await api.patch(`/products/${id}`, product);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};

// src/lib/api.js

export async function getAccounts() {
  const res = await fetch("/api/accounts");
  if (!res.ok) {
    throw new Error("Failed to fetch accounts");
  }
  return res.json();
}


export default api;
