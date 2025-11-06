'use client';

import AccountList from '@/components/accounts/AccountList';

export default function AccountsPage() {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Account Management</h1>
        <p className="text-gray-500 mt-1">Create, view, edit, and delete your accounts.</p>
      </header>
      <AccountList />
    </div>
  );
}
