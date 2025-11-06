"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import useGrnStore from '@/store/grnStore';
import useAppStore from '@/store/useAppStore';

const grnItemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  sku: z.string().min(1, "Variant is required"),
  warehouse: z.string().min(1, "Warehouse is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
});

const grnSchema = z.object({
  date: z.string().min(1, "Date is required"),
  account: z.string().min(1, "Account is required"),
  items: z.array(grnItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

const GrnForm = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { addGrn } = useGrnStore();
  const { user } = useAppStore();

  const { register, handleSubmit, control, setValue, reset, formState: { errors, isValid }, watch } = useForm({
    resolver: zodResolver(grnSchema),
    mode: 'onChange',
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      account: '',
      items: [{ product: '', sku: '', warehouse: '', quantity: 1, cost: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  const grandTotal = useMemo(() => {
    return watchedItems.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const cost = Number(item.cost) || 0;
      return total + (quantity * cost);
    }, 0);
  }, [watchedItems]);

  useEffect(() => {
    const fetchData = async (url, setter, name) => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // Ensure data.data is an array before setting state
        setter(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error(`Failed to fetch ${name}`, error);
        toast.error(`Failed to fetch ${name}`);
        setter([]); // Set to empty array on error
      }
    };

    fetchData('/api/products', setProducts, 'products');
    fetchData('/api/warehouses', setWarehouses, 'warehouses');
    fetchData('/api/accounts', setAccounts, 'accounts');
  }, []);

  const onSubmit = async (data) => {
    try {
      await addGrn({ ...data, createdBy: user._id });
      reset();
      router.push('/dashboard/inventory/grn');
    } catch (error) {
      console.error("Failed to create GRN", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Goods Received Note (GRN)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>
            <div>
              <Label htmlFor="account">Account</Label>
              <Select onValueChange={(value) => setValue('account', value)} value={watch('account')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter(acc => ['Assets', 'Liability'].includes(acc.type))
                    .map(acc => <SelectItem key={acc._id} value={acc._id}>{acc.name} ({acc.type})</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.account && <p className="text-red-500 text-sm">{errors.account.message}</p>}
            </div>
          </div>

          <div>
            <Label className="text-lg font-semibold">Items</Label>
            <div className="space-y-4">
              {fields.map((item, index) => {
                const lineTotal = (Number(watchedItems[index]?.quantity) || 0) * (Number(watchedItems[index]?.cost) || 0);
                return (
                  <div key={item.id} className="p-4 border rounded-md space-y-4 relative">
                     <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="absolute top-2 right-2">
                       <Trash2 className="h-4 w-4" />
                     </Button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Product</Label>
                        <Select
                          onValueChange={(value) => {
                            const product = products.find(p => p._id === value);
                            const newSelectedProducts = [...selectedProducts];
                            newSelectedProducts[index] = product;
                            setSelectedProducts(newSelectedProducts);
                            setValue(`items.${index}.product`, value);
                            setValue(`items.${index}.sku`, ''); // Reset SKU on product change
                          }}
                        >
                          <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                          <SelectContent>{products.map(p => <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>)}</SelectContent>
                        </Select>
                        {errors.items?.[index]?.product && <p className="text-red-500 text-sm">{errors.items[index].product.message}</p>}
                      </div>
                      <div>
                        <Label>Variant (SKU)</Label>
                        <Select onValueChange={(value) => setValue(`items.${index}.sku`, value)} disabled={!selectedProducts[index]}>
                          <SelectTrigger><SelectValue placeholder="Select variant" /></SelectTrigger>
                          <SelectContent>{selectedProducts[index]?.skus.map(s => <SelectItem key={s.sku} value={s.sku}>{s.sku}</SelectItem>)}</SelectContent>
                        </Select>
                        {errors.items?.[index]?.sku && <p className="text-red-500 text-sm">{errors.items[index].sku.message}</p>}
                      </div>
                      <div>
                        <Label>Warehouse</Label>
                        <Select onValueChange={(value) => setValue(`items.${index}.warehouse`, value)}>
                          <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                          <SelectContent>{warehouses.map(w => <SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>)}</SelectContent>
                        </Select>
                        {errors.items?.[index]?.warehouse && <p className="text-red-500 text-sm">{errors.items[index].warehouse.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <Label>Quantity</Label>
                        <Input type="number" {...register(`items.${index}.quantity`)} placeholder="e.g., 10" />
                        {errors.items?.[index]?.quantity && <p className="text-red-500 text-sm">{errors.items[index].quantity.message}</p>}
                      </div>
                      <div>
                        <Label>Unit Cost</Label>
                        <Input type="number" step="0.01" {...register(`items.${index}.cost`)} placeholder="e.g., 15.50" />
                        {errors.items?.[index]?.cost && <p className="text-red-500 text-sm">{errors.items[index].cost.message}</p>}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">Line Total: ${lineTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ product: '', sku: '', warehouse: '', quantity: 1, cost: 0 })} className="mt-4">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Item
            </Button>
            {errors.items && <p className="text-red-500 text-sm mt-2">{errors.items.message}</p>}
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register("notes")} />
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Grand Total: ${grandTotal.toFixed(2)}</h3>
            <Button type="submit" disabled={!isValid}>Create GRN</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GrnForm;
