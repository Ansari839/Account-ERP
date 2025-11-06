'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AccountForm = ({ onSuccess, editData }) => {
  const form = useForm({
    defaultValues: {
      name: '',
      parent: '',
      type: 'Asset',
      openingDebit: 0,
      openingCredit: 0,
      category: '',
    }
  });

  const { handleSubmit, reset, setValue, formState: { isSubmitting } } = form;

  const [accounts, setAccounts] = useState([]);

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
        toast.error('Could not load parent accounts.');
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
    try {
      let response;
      const payload = { ...data, parent: data.parent || null };

      if (editData) {
        // Update existing account
        response = await axios.patch(`/api/accounts/${editData._id}`, payload);
        toast.success('Account updated successfully!');
      } else {
        // Create new account
        response = await axios.post('/api/accounts', payload);
        toast.success('Account created successfully!');
      }

      if (response.data.success) {
        reset();
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'An unexpected error occurred.';
      toast.error(errorMsg);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          rules={{ required: "Account name is required." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Account Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type Field */}
        <FormField
          control={form.control}
          name="type"
          rules={{ required: "Account type is required." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Asset">Asset</SelectItem>
                  <SelectItem value="Liability">Liability</SelectItem>
                  <SelectItem value="Capital">Capital</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Parent Account Field */}
        <FormField
          control={form.control}
          name="parent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Account (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={null}>None</SelectItem>
                  {accounts.filter(acc => acc._id !== editData?._id).map(acc => (
                    <SelectItem key={acc._id} value={acc._id}>{acc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Opening Balance Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="openingDebit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Debit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value) || 0);
                      if (e.target.value) {
                        setValue('openingCredit', 0);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="openingCredit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Credit</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => {
                      field.onChange(parseFloat(e.target.value) || 0);
                      if (e.target.value) {
                        setValue('openingDebit', 0);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category Field */}
        <FormField
          control={form.control}
          name="category"
          rules={{ required: "Category is required." }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Customer, Supplier, Expense" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (editData ? 'Update Account' : 'Save Account')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AccountForm;
