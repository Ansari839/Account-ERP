// src/app/api/products/route.js
import { getProducts, createProduct } from "@/controllers/productController";

export async function GET() {
  return getProducts();
}

export async function POST(req) {
  return createProduct(req);
}
