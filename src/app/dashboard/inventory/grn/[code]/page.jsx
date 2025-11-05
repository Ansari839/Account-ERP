'use client';

import GrnForm from '@/components/inventory/GrnForm';
import { useParams } from 'next/navigation';

const GrnDetailsPage = () => {
  const { code } = useParams();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">GRN Details</h1>
      <GrnForm grnCode={code} />
    </div>
  );
};

export default GrnDetailsPage;
