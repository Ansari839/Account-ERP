import { createWarehouse, getWarehouses } from '@/controllers/warehouseController';

export async function GET() {
  return getWarehouses();
}

export async function POST(req) {
  return createWarehouse(req);
}