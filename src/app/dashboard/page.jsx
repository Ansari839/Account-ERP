'use client';
import React, { useState } from 'react';

const TabButton = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-semibold border-b-2 transition-colors duration-300 ${
      isActive
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {title}
  </button>
);

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('Sales');

  return (
    <div className="flex flex-col items-center pt-10">
      {/* Tabs */}
      <div className="w-full max-w-6xl px-4 mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
            <TabButton title="Sales" isActive={activeTab === 'Sales'} onClick={() => setActiveTab('Sales')} />
            <TabButton title="Purchase" isActive={activeTab === 'Purchase'} onClick={() => setActiveTab('Purchase')} />
            <TabButton title="Journal Voucher" isActive={activeTab === 'Journal Voucher'} onClick={() => setActiveTab('Journal Voucher')} />
            <TabButton title="Reports" isActive={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} />
          </nav>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Sales</h2>
          <p className="text-3xl font-bold">$0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Purchases</h2>
          <p className="text-3xl font-bold">$0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Customers</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full max-w-6xl px-4 mt-8">
        {activeTab === 'Sales' && <div>Sales Content Here</div>}
        {activeTab === 'Purchase' && <div>Purchase Content Here</div>}
        {activeTab === 'Journal Voucher' && <div>Journal Voucher Content Here</div>}
        {activeTab === 'Reports' && <div>Reports Content Here</div>}
      </div>
    </div>
  );
};

export default DashboardPage;