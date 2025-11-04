'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AccountForm = ({ onSuccess, editData }) => {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      parent: '',
      type: 'Asset',
      openingDebit: 0,
      openingCredit: 0,
    }
  });

  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch accounts for the parent dropdown
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('/api/accounts');
        if (response.data.success) {
          setAccounts(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
        setMessage({ type: 'error', text: 'Could not load parent accounts.' });
      }
    };
    fetchAccounts();
  }, []);

  // Populate form when editData is provided
  useEffect(() => {
    if (editData) {
      setValue('name', editData.name);
      setValue('parent', editData.parent?._id || '');
      setValue('type', editData.type);
      if (editData.openingType === 'Debit') {
        setValue('openingDebit', editData.openingBalance);
        setValue('openingCredit', 0);
      } else {
        setValue('openingCredit', editData.openingBalance);
        setValue('openingDebit', 0);
      }
      setValue('category', editData.category);
    } else {
      reset(); // Clear form if editData is null (e.g., after an edit is cancelled)
    }
  }, [editData, setValue, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let response;
      const payload = { ...data, parent: data.parent || null };

      if (editData) {
        // Update existing account
        response = await axios.patch(`/api/accounts/${editData._id}`, payload);
        setMessage({ type: 'success', text: 'Account updated successfully!' });
      } else {
        // Create new account
        response = await axios.post('/api/accounts', payload);
        setMessage({ type: 'success', text: 'Account created successfully!' });
      }

      if (response.data.success) {
        reset();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'An unexpected error occurred.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    }
  };

  return (
    <div className="w-full md:w-1/2 mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{editData ? 'Edit Account' : 'Create New Account'}</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              {...register('name', { required: 'Account name is required.' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Type Field */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type"
              {...register('type', { required: 'Account type is required.' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="Asset">Asset</option>
              <option value="Liability">Liability</option>
                                <option value="Capital">Capital</option>              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>

          {/* Parent Account Field */}
          <div>
            <label htmlFor="parent" className="block text-sm font-medium text-gray-700">Parent Account (Optional)</label>
            <select
              id="parent"
              {...register('parent')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">None</option>
              {accounts.filter(acc => acc._id !== editData?._id).map(acc => (
                <option key={acc._id} value={acc._id}>{acc.name}</option>
              ))}
            </select>
          </div>

          {/* Opening Balance Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="openingDebit" className="block text-sm font-medium text-gray-700">Opening Debit</label>
              <input
                id="openingDebit"
                type="number"
                step="0.01"
                {...register('openingDebit', { valueAsNumber: true })}
                onChange={(e) => {
                  if (e.target.value) {
                    setValue('openingCredit', 0);
                  }
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="openingCredit" className="block text-sm font-medium text-gray-700">Opening Credit</label>
              <input
                id="openingCredit"
                type="number"
                step="0.01"
                {...register('openingCredit', { valueAsNumber: true })}
                onChange={(e) => {
                  if (e.target.value) {
                    setValue('openingDebit', 0);
                  }
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Category Field */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              id="category"
              type="text"
              {...register('category', { required: 'Category is required.' })}
              placeholder="e.g. Customer, Supplier, Expense"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 font-semibold text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400
                ${editData 
                  ? 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500' 
                  : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'}`
              }
            >
              {isLoading ? 'Saving...' : (editData ? 'Update Account' : 'Save Account')}
            </button>
          </div>
        </form>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mt-4 text-sm p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountForm;