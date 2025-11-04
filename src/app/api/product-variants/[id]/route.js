import { getVariantById, updateVariant, deleteVariant } from '@/controllers/productVariant.controller';

export async function GET(req, context) {
  const params = await context.params;
  return getVariantById(req, { params });
}

export async function PATCH(req, context) {
  const params = await context.params;
  return updateVariant(req, { params });
}

export async function DELETE(req, context) {
  const params = await context.params;
  return deleteVariant(req, { params });
}
