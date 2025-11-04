import { getProductById, updateProduct, deleteProduct } from '@/controllers/productController';

export async function GET(req, { params }) {
  return getProductById(req, { params });
}

export async function PATCH(req, { params }) {
  return updateProduct(req, { params });
}

export async function DELETE(req, { params }) {
  return deleteProduct(req, { params });
}
