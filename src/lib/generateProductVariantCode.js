import ProductVariant from '@/models/ProductVariant';

export async function generateProductVariantCode() {
  const latestVariant = await ProductVariant.findOne().sort({ transactionCode: -1 });
  let nextId = 1;
  if (latestVariant && latestVariant.transactionCode) {
    const lastId = parseInt(latestVariant.transactionCode.substring(2));
    nextId = lastId + 1;
  }
  return `PV${nextId}`;
}
