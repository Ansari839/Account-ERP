import { getWarehouseById, updateWarehouse, deleteWarehouse } from '@/controllers/warehouseController';

export async function GET(req, context) {
  const params = await context.params;
  return getWarehouseById(req, { params });
}

export async function PATCH(req, context) {
  const params = await context.params;
  return updateWarehouse(req, { params });
}

export async function DELETE(req, context) {
  const params = await context.params;
  return deleteWarehouse(req, { params });
}