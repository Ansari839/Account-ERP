import Product from '@/models/Product';

export async function generateProductCode() {
  const latestProduct = await Product.findOne().sort({ transactionCode: -1 });
  let nextId = 1;
  if (latestProduct && latestProduct.transactionCode) {
    const lastId = parseInt(latestProduct.transactionCode.substring(2));
    nextId = lastId + 1;
  }
  return `PR${nextId}`;
}
