'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCompanyInfo } from '@/hooks/useCompanyInfo';

const ReportHeader = () => {
  const { company, activeFiscalYear } = useCompanyInfo();
  if (!company) return null;

  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-extrabold text-gray-800">{company.name}</h1>
      <p className="text-gray-600">{company.address}</p>
      <p className="text-sm text-gray-500 mt-1">
        For the Fiscal Year: {activeFiscalYear?.name || 'N/A'}
        {activeFiscalYear && ` (${new Date(activeFiscalYear.startDate).toLocaleDateString()} - ${new Date(activeFiscalYear.endDate).toLocaleDateString()})`}
      </p>
    </div>
  );
};

const BalanceSheet = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      try {
        const url = filterCategory ? `/api/accounts?category=${filterCategory}` : '/api/accounts';
        const res = await fetch(url, { cache: "no-store" });
        const result = await res.json();
        if (result.success) {
          console.log('Fetched Accounts:', result.data);
          setAccounts(result.data);
        } else {
          throw new Error(result.error || 'Failed to fetch accounts');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccounts();
  }, [filterCategory]);

  const assets = accounts.filter(acc => acc.type.toLowerCase() === 'asset');
  const liabilities = accounts.filter(acc => acc.type.toLowerCase() === 'liability');
  const capital = accounts.filter(acc => acc.type.toLowerCase() === 'capital');

  const totalAssets = assets.reduce((sum, acc) => sum + acc.openingBalance, 0);
  const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.openingBalance, 0);
  const totalCapital = capital.reduce((sum, acc) => sum + acc.openingBalance, 0);
  const isBalanced = totalAssets === totalLiabilities + totalCapital;

  const chartData = [
    { name: 'Assets', value: totalAssets },
    { name: 'Liabilities', value: totalLiabilities },
    { name: 'Capital', value: totalCapital },
  ];

  const AccountRow = ({ name, amount }) => (
    <div className="flex justify-between items-center py-2 border-b border-dotted">
      <span className="text-gray-600">{name}</span>
      <span className="font-mono text-gray-800">{new Intl.NumberFormat().format(amount)}</span>
    </div>
  );

  const AccountGroup = ({ title, accountList, total }) => (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h3 className="text-xl font-bold mb-4 border-b-2 pb-2 text-gray-800">{title}</h3>
      <div className="space-y-2">
        {accountList.length > 0 ? (
          accountList.map(acc => <AccountRow key={acc._id} name={acc.name} amount={acc.openingBalance} />)
        ) : (
          <p className="text-sm text-gray-500">No accounts found.</p>
        )}
      </div>
      <div className="mt-4 pt-2 border-t-2 border-gray-300">
        <div className="flex justify-between items-center font-bold text-lg">
          <span className="text-gray-900">Total {title}</span>
          <span className="font-mono text-gray-900">{new Intl.NumberFormat().format(total)}</span>
        </div>
      </div>
    </div>
  );

  if (isLoading) return <p className="text-center text-gray-500">Loading report data...</p>;
  if (error) return <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">Error: {error}</p>;

  return (
    <div className="space-y-8">
      <ReportHeader />
      
      <div className="mb-6 flex justify-center">
        <select 
          onChange={(e) => setFilterCategory(e.target.value)}
          value={filterCategory}
          className="border p-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          <option value="Customer">Customer</option>
          <option value="Supplier">Supplier</option>
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
          <option value="Bank">Bank</option>
          <option value="Cash">Cash</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <AccountGroup title="Assets" accountList={assets} total={totalAssets} />
        </div>
        <div className="w-full space-y-8">
          <AccountGroup title="Liabilities" accountList={liabilities} total={totalLiabilities} />
          <AccountGroup title="Capital" accountList={capital} total={totalCapital} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold text-gray-800">Total Assets = Total Liabilities + Total Capital</h3>
        <p className="font-mono text-lg mt-2">
          {new Intl.NumberFormat().format(totalAssets)} = {new Intl.NumberFormat().format(totalLiabilities)} + {new Intl.NumberFormat().format(totalCapital)}
        </p>
        <p className={`mt-2 text-lg font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
          {isBalanced ? '✔ Balanced' : '❌ Not Balanced'}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-6 text-center text-gray-800">Totals Comparison</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
              <Legend />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;