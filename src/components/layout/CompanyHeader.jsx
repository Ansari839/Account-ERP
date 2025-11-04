"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

const CompanyHeader = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const res = await fetch('/api/company');
        if (!res.ok) {
          throw new Error('Failed to fetch company information');
        }
        const data = await res.json();
        setCompanyInfo(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching company info:", err);
      }
    };

    fetchCompanyInfo();
  }, []);

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  if (!companyInfo) {
    return <div className="text-center p-4 text-gray-500">Loading company information...</div>;
  }

  const { companyName, logo, address, ntn, fiscalYear } = companyInfo;
  const { startDate, endDate } = fiscalYear || {};

  return (
    <div className="text-center p-4 bg-gray-50 border-b border-gray-200 mb-8">
      {logo && <Image src={logo} alt={`${companyName} Logo`} width={100} height={100} className="max-w-xs mb-2 mx-auto" />}
      <h1 className="text-2xl font-bold">{companyName}</h1>
      <p className="my-1">{address}</p>
      <p className="my-1">NTN: {ntn}</p>
      {fiscalYear && (
        <p className="my-1 text-sm text-gray-500">
          Fiscal Year: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default CompanyHeader;
