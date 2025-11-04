import Warehouse from '@/models/Warehouse';

export async function generateWarehouseCode() {
  const latestWarehouse = await Warehouse.findOne().sort({ transactionCode: -1 });
  let nextId = 1;
  if (latestWarehouse && latestWarehouse.transactionCode) {
    const lastId = parseInt(latestWarehouse.transactionCode.substring(2));
    nextId = lastId + 1;
  }
  return `WH${nextId}`;
}