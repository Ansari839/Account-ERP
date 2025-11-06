import Product from '@/models/Product';


export const generateProductCode = async () => {
  await dbConnect();
  try {
    const lastProduct = await Product.findOne().sort({ createdAt: -1 });
    const newCode = lastProduct ? lastProduct.code + 1 : 1;
    return newCode;
  } catch (error) {
    console.error('Error generating product code:', error);
    throw new Error('Could not generate product code');
  }
};
