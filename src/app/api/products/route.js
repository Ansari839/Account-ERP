import { getProducts, createProduct } from '@/controllers/productController';

export async function GET(req) {
  return getProducts(req);
}

export async function POST(req) {
  return createProduct(req);
}