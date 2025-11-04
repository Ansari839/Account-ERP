import { getCategoryById, updateCategory, deleteCategory } from '@/controllers/productCategory.controller';

export async function GET(req, context) {
  const params = await context.params; // Unwrap the params Promise
  return getCategoryById(req, { params });
}

export async function PATCH(req, context) {
  const params = await context.params; // Unwrap the params Promise
  return updateCategory(req, { params });
}

export async function DELETE(req, context) {
  const params = await context.params; // Unwrap the params Promise
  return deleteCategory(req, { params });
}
