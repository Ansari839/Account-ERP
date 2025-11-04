'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export function useCompanyInfo() {
  const [company, setCompany] = useState(null);
  const [activeFiscalYear, setActiveFiscalYear] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [companyRes, fiscalYearRes] = await Promise.all([
          axios.get('/api/company'),
          axios.get('/api/fiscal-year')
        ]);

        if (companyRes.data) {
          setCompany(companyRes.data);
        }

        if (Array.isArray(fiscalYearRes.data)) {
          const activeYear = fiscalYearRes.data.find(fy => fy.isActive);
          setActiveFiscalYear(activeYear);
        }
      } catch (error) {
        console.error("Failed to fetch company or fiscal year data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { company, activeFiscalYear, loading };
}