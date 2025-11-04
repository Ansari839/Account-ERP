'use client';

import { useState, useEffect, useMemo } from 'react';
import useProductVariantStore from '@/store/productVariantStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { getWarehouses, getAccounts, getCategories } from '@/lib/api';

// Helper function to generate permutations
const getPermutations = (arrays) => {
  if (!arrays || arrays.length === 0) {
    return [[]];
  }
  const [first, ...rest] = arrays;
  const permutationsOfRest = getPermutations(rest);
  const result = [];
  first.forEach(item => {
    permutationsOfRest.forEach(permutation => {
      result.push([item, ...permutation]);
    });
  });
  return result;
};


const ProductForm = () => {
  const { variants: allVariants, fetchVariants } = useProductVariantStore();
  
  // Form state
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  
  // Variant selection state
  const [selectedVariants, setSelectedVariants] = useState([]);
  
  // SKU state
  const [skus, setSkus] = useState([]);

  // Data state
  const [warehouses, setWarehouses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVariants();
    const fetchInitialData = async () => {
      try {
        const [warehouseData, accountData, categoryData] = await Promise.all([
          getWarehouses(), 
          getAccounts(),
          getCategories()
        ]);
        setWarehouses(warehouseData || []);
        setAccounts(accountData || []);
        setCategories(categoryData || []);
      } catch (err) {
        setError("Failed to load initial data.");
      }
    };
    fetchInitialData();
  }, [fetchVariants]);

  // Generate SKUs whenever selected variants change
  useMemo(() => {
    if (selectedVariants.length === 0 || selectedVariants.some(v => v.options.length === 0)) {
      setSkus([]);
      return;
    }

    const variantOptionsArrays = selectedVariants.map(v => v.options.map(opt => ({ name: v.variant.name, option: opt })));
    const permutations = getPermutations(variantOptionsArrays);
    
    const newSkus = permutations.map(p => {
      const variantOptions = {};
      let skuString = name.toUpperCase().replace(/\s+/g, '-');
      p.forEach(item => {
        if(item) {
          variantOptions[item.name] = item.option;
          skuString += `-${item.option.toUpperCase()}`;
        }
      });

      const existingSku = skus.find(s => s.sku === skuString);

      return {
        sku: skuString,
        variantOptions,
        price: existingSku?.price || basePrice || '',
        stockByWarehouse: warehouses.map(w => {
          const existingStock = existingSku?.stockByWarehouse.find(sw => sw.warehouse === w._id);
          return {
            warehouse: w._id,
            name: w.name, // For display
            stock: existingStock?.stock || 0,
          };
        }),
      };
    });

    setSkus(newSkus);
  }, [selectedVariants, basePrice, name, warehouses]);

  const handleVariantTypeChange = (variantId) => {
    const variantObject = allVariants.find(v => v._id === variantId);
    if (variantObject && !selectedVariants.find(v => v.variant._id === variantObject._id)) {
      setSelectedVariants([...selectedVariants, { variant: variantObject, options: [] }]);
    }
  };

  const handleVariantOptionChange = (variantId, newOptions) => {
    setSelectedVariants(
      selectedVariants.map(v => 
        v.variant._id === variantId ? { ...v, options: newOptions } : v
      )
    );
  };

  const removeVariantType = (variantId) => {
    setSelectedVariants(selectedVariants.filter(v => v.variant._id !== variantId));
  };

  const handleSkuChange = (skuIndex, field, value) => {
    const updatedSkus = [...skus];
    updatedSkus[skuIndex][field] = value;
    setSkus(updatedSkus);
  };

  const handleSkuStockChange = (skuIndex, warehouseId, value) => {
    const updatedSkus = [...skus];
    const stockIndex = updatedSkus[skuIndex].stockByWarehouse.findIndex(s => s.warehouse === warehouseId);
    updatedSkus[skuIndex].stockByWarehouse[stockIndex].stock = parseInt(value, 10) || 0;
    setSkus(updatedSkus);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const productData = {
      name,
      price: basePrice,
      cost,
      description,
      category,
      account,
      skus: skus.map(({ name, ...rest }) => rest), // Remove temporary name field
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      alert('Product created successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto p-4">
      {/* Basic product fields */}
      <div className="grid grid-cols-3 gap-4">
        <div>
            <Label>Product Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
            <Label>Base Price</Label>
            <Input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} required />
        </div>
        <div>
            <Label>Cost</Label>
            <Input type="number" value={cost} onChange={e => setCost(e.target.value)} />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={setCategory} value={category}>
            <SelectTrigger><SelectValue placeholder="Select category..." /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Account</Label>
          <Select onValueChange={setAccount} value={account}>
            <SelectTrigger><SelectValue placeholder="Select account..." /></SelectTrigger>
            <SelectContent>
              {accounts.map(a => <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-3">
          <Label>Description</Label>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} />
        </div>
      </div>
      
      {/* Variant Selection */}
      <div className="space-y-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium">Variants</h3>
        <Select onValueChange={handleVariantTypeChange}>
          <SelectTrigger><SelectValue placeholder="Add a variant type..." /></SelectTrigger>
          <SelectContent>
            {allVariants
              .filter(av => !selectedVariants.some(sv => sv.variant._id === av._id))
              .map(variant => (
                <SelectItem key={variant._id} value={variant._id}>{variant.name}</SelectItem>
              ))}
          </SelectContent>
        </Select>

        {selectedVariants.map(({ variant, options }) => (
          <div key={variant._id} className="p-2 border rounded-md">
            <div className="flex justify-between items-center mb-2">
              <Label>{variant.name}</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeVariantType(variant._id)}>Remove</Button>
            </div>
            <MultiSelect
              options={variant.options.map(o => ({ label: o, value: o }))}
              selected={options}
              onChange={(newOptions) => handleVariantOptionChange(variant._id, newOptions)}
              placeholder={`Select ${variant.name}...`}
            />
          </div>
        ))}
      </div>

      {/* SKU Table */}
      {skus.length > 0 && (
        <div className="space-y-4 p-4 border rounded-md">
            <h3 className="text-lg font-medium">Stock & Price</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead>Price</TableHead>
                        {warehouses.map(w => <TableHead key={w._id}>{w.name} Stock</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {skus.map((sku, skuIndex) => (
                        <TableRow key={sku.sku}>
                            <TableCell className="font-mono text-xs">{sku.sku}</TableCell>
                            <TableCell>{Object.values(sku.variantOptions).join(' / ')}</TableCell>
                            <TableCell>
                                <Input 
                                    type="number"
                                    value={sku.price}
                                    onChange={e => handleSkuChange(skuIndex, 'price', e.target.value)}
                                    placeholder="Base Price"
                                />
                            </TableCell>
                            {sku.stockByWarehouse.map((sw, stockIndex) => (
                              <TableCell key={sw.warehouse}>
                                <Input 
                                  type="number"
                                  value={sw.stock}
                                  onChange={e => handleSkuStockChange(skuIndex, sw.warehouse, e.target.value)}
                                />
                              </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;