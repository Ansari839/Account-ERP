import ProductCategory from '@/models/ProductCategory';

export async function generateProductCategoryCode() {
  const latestCategory = await ProductCategory.findOne().sort({ transactionCode: -1 });
  let nextId = 1;
  if (latestCategory) {
    const lastId = parseInt(latestCategory.transactionCode.substring(2));
    nextId = lastId + 1;
  }
  return `PC${nextId}`;
}
