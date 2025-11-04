import BalanceSheet from '@/components/reports/BalanceSheet';

export default function ReportsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Balance Sheet Report
        </h1>
        <p className="mt-2 text-lg text-gray-500">As of {new Date().toLocaleDateString()}</p>
      </header>
      <main>
        <BalanceSheet />
      </main>
    </div>
  );
}