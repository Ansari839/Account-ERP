'use client';

import ProductForm from '@/components/ProductForm';
import { useParams } from 'next/navigation';

const EditProductPage = () => {
  const { id } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm productId={id} />
    </div>
  );
};

export default EditProductPage;
