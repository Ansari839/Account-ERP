'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const AccountList = ({ onEdit, refreshKey }) => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch accounts when component mounts or refreshKey changes
  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/accounts');
        if (response.data.success) {
          setAccounts(response.data.data);
        } else {
          throw new Error('Failed to fetch accounts');
        }
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || 'An unexpected error occurred.';
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccounts();
  }, [refreshKey]);

  // Handle account deletion
  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await axios.delete(`/api/accounts/${accountId}`);
        // Refetch accounts after deletion by updating the list state
        setAccounts(prevAccounts => prevAccounts.filter(acc => acc._id !== accountId));
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to delete account.';
        alert(errorMsg); // Simple alert for error feedback
      }
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading accounts...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 bg-red-100 p-4 rounded-md">Error: {error}</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Account List</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Parent</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3 text-right">Opening Balance</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  No Accounts Found
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account._id} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {account.name}
                  </th>
                  <td className="px-6 py-4">{account.parent?.name || '-'}</td>
                  <td className="px-6 py-4">{account.type}</td>
                  <td className="px-6 py-4 text-right font-mono">{new Intl.NumberFormat().format(account.openingBalance)}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => onEdit(account)}
                      className="font-medium text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(account._id)}
                      className="font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded shadow-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountList;