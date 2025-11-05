import GrnList from '@/components/inventory/GrnList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const PurchasesPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Purchases</h1>
        <Button asChild>
          <Link href="/dashboard/inventory/grn">Create GRN</Link>
        </Button>
      </div>
      <GrnList />
    </div>
  );
};

export default PurchasesPage;
