'use client';

import { useState } from 'react';
import AccountForm from '@/components/forms/AccountForm';
import AccountList from '@/components/accounts/AccountList';

export default function AccountsPage() {
  // State to hold the account data for editing
  const [editData, setEditData] = useState(null);
  
  // State key to trigger a refresh in the AccountList component
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Handles the edit action from the AccountList.
   * Sets the selected account data to be passed to the AccountForm.
   * @param {object} account - The account object to edit.
   */
  const handleEdit = (account) => {
    setEditData(account);
  };

  /**
   * Handles successful form submission (create or update).
   * Clears the edit data to reset the form and increments the refresh key
   * to trigger a data refetch in the AccountList.
   */
  const handleSuccess = () => {
    setEditData(null); // Clear the form
    setRefreshKey(prevKey => prevKey + 1); // Trigger list refresh
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Account Management</h1>
        <p className="text-gray-500 mt-1">Create, view, edit, and delete your accounts.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Form */}
        <div className="lg:col-span-1">
          <AccountForm 
            onSuccess={handleSuccess} 
            editData={editData} 
          />
        </div>

        {/* Right Column: Account List */}
        <div className="lg:col-span-2">
          <AccountList 
            onEdit={handleEdit} 
            refreshKey={refreshKey} 
          />
        </div>
      </div>
    </div>
  );
}