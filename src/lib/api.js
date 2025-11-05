// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Requesting URL: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`Error: ${error.message}`);
    return Promise.reject(error);
  }
);

//////////////////////////
// Product Categories
//////////////////////////
export const getCategories = async () => {
  const response = await api.get("/product-categories");
  return response.data.data;
};

export const createCategory = async (category) => {
  const response = await api.post("/product-categories", category);
  return response.data.data;
};

export const updateCategory = async (id, category) => {
  const response = await api.patch(`/product-categories/${id}`, category);
  return response.data.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/product-categories/${id}`);
  return response.data.data;
};

//////////////////////////
// Warehouses
//////////////////////////
export const getWarehouses = async () => {
  const response = await api.get("/warehouses");
  return response.data.data;
};

export const createWarehouse = async (warehouse) => {
  const response = await api.post("/warehouses", warehouse);
  return response.data.data;
};

export const updateWarehouse = async (id, warehouse) => {
  const response = await api.patch(`/warehouses/${id}`, warehouse);
  return response.data.data;
};

export const deleteWarehouse = async (id) => {
  const response = await api.delete(`/warehouses/${id}`);
  return response.data.data;
};

//////////////////////////
// Product Variants
//////////////////////////
export const getVariants = async () => {
  const response = await api.get("/product-variants");
  return response.data.data;
};

export const createVariant = async (variant) => {
  const response = await api.post("/product-variants", variant);
  return response.data.data;
};

export const updateVariant = async (id, variant) => {
  const response = await api.patch(`/product-variants/${id}`, variant);
  return response.data.data;
};

export const deleteVariant = async (id) => {
  const response = await api.delete(`/product-variants/${id}`);
  return response.data.data;
};

//////////////////////////
// Products
//////////////////////////
export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data.data;
};

export const createProduct = async (product) => {
  const response = await api.post("/products", product);
  return response.data.data;
};

export const updateProduct = async (id, product) => {
  const response = await api.patch(`/products/${id}`, product);
  return response.data.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data.data;
};

///////////////////////////
// Accounts
//////////////////////////
export const getAccounts = async () => {
  const response = await api.get("/accounts");
  return response.data.data;
};

export default api;
