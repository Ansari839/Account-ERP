'use client';

import { useState, useEffect } from 'react';
import useProductVariantStore from '@/store/productVariantStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from '@/lib/api';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Helper function to generate permutations
const getPermutations = (arrays) => {
  if (!arrays || arrays.length === 0) return [[]];
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

const ProductForm = ({ productId }) => {
  const { variants: allVariants, fetchVariants } = useProductVariantStore();
  
  // Form state
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [cost, setCost] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  
  // Variant selection state
  const [selectedVariants, setSelectedVariants] = useState([]);
  
  // SKU state
  const [skus, setSkus] = useState([]);
  
  // Data state
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  useEffect(() => {
    fetchVariants();
    const fetchInitialData = async () => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData || []);
        if (productId) {
          const res = await fetch(`/api/products/${productId}`);
          const result = await res.json();
          if (result.success) {
            const product = result.data;
            setName(product.name);
            setBasePrice(product.price);
            setCost(product.cost);
            setDescription(product.description);
            setCategory(product.category);
            setSkus(product.skus);
            // Reconstruct selectedVariants from skus
          }
        }
      } catch (err) {
        setError("Failed to load initial data.");
      }
    };
    fetchInitialData();
  }, [fetchVariants, productId]);

  // Generate SKUs whenever selected variants change
  useEffect(() => {
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
      return { sku: skuString, variantOptions, price: basePrice || '' };
    });
    setSkus(newSkus);
  }, [selectedVariants, basePrice, name]);

  const handleVariantTypeChange = (variantId) => {
    const variantObject = allVariants.find(v => v._id === variantId);
    if (variantObject && !selectedVariants.find(v => v.variant._id === variantObject._id)) {
      setSelectedVariants([...selectedVariants, { variant: variantObject, options: [] }]);
    }
  };

  const handleVariantOptionChange = (variantId, newOptions) => {
    setSelectedVariants(selectedVariants.map(v => v.variant._id === variantId ? { ...v, options: newOptions } : v));
  };

  const removeVariantType = (variantId) => {
    setSelectedVariants(selectedVariants.filter(v => v.variant._id !== variantId));
  };

  const handleSkuPriceChange = (skuIndex, value) => {
    const updatedSkus = [...skus];
    updatedSkus[skuIndex].price = value;
    setSkus(updatedSkus);
  };

  const handleCreate = async (productData) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return response.json();
  };

  const handleUpdate = async (productData) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return response.json();
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'An unknown error occurred');
      }
      alert('Product deleted successfully!');
      // Redirect or update UI
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const finalSkus = skus.map(sku => ({
      ...sku,
      price: parseFloat(sku.price) || parseFloat(basePrice),
      stockByWarehouse: sku.stockByWarehouse || [],
    }));

    const productData = {
      name,
      price: parseFloat(basePrice),
      cost: parseFloat(cost) || 0,
      description,
      category,
      skus: finalSkus,
    };

    try {
      const result = productId ? await handleUpdate(productData) : await handleCreate(productData);

      if (!result.success) {
        throw new Error(result.message || 'An unknown error occurred');
      }

      alert(`Product ${productId ? 'updated' : 'created'} successfully!`);
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center">
          {[...Array(totalSteps)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > i ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {i + 1}
              </div>
              {i < totalSteps - 1 && <div className={`w-12 h-1 ${step > i + 1 ? 'bg-primary' : 'bg-muted'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Provide the essential details for your new product.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Product Name</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Base Price</Label><Input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} required /></div>
            <div className="space-y-2"><Label>Cost</Label><Input type="number" value={cost} onChange={e => setCost(e.target.value)} /></div>
            <div className="space-y-2"><Label>Category</Label>
              <Select onValueChange={setCategory} value={category}><SelectTrigger><SelectValue placeholder="Select category..." /></SelectTrigger>
                <SelectContent>{categories.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 md:col-span-3 space-y-2"><Label>Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} /></div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
            <CardDescription>Define product variations like size or color.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={handleVariantTypeChange}>
              <SelectTrigger><SelectValue placeholder="Add a variant type..." /></SelectTrigger>
              <SelectContent>{allVariants.filter(av => !selectedVariants.some(sv => sv.variant._id === av._id)).map(variant => <SelectItem key={variant._id} value={variant._id}>{variant.name}</SelectItem>)}</SelectContent>
            </Select>
            {selectedVariants.map(({ variant, options }) => (
              <div key={variant._id} className="p-4 border rounded-lg bg-muted/40">
                <div className="flex justify-between items-center mb-2">
                  <Label className="font-semibold text-base">{variant.name}</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeVariantType(variant._id)}>Remove</Button>
                </div>
                <MultiSelect options={variant.options.map(o => ({ label: o, value: o }))} selected={options} onChange={(newOptions) => handleVariantOptionChange(variant._id, newOptions)} placeholder={`Select ${variant.name}...`} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 3 && skus.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Stock Keeping Units (SKUs)</CardTitle>
            <CardDescription>Manage pricing for each unique product variant.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Variant</TableHead><TableHead className="w-32">Price</TableHead></TableRow></TableHeader>
              <TableBody>{skus.map((sku, skuIndex) => (
                <TableRow key={sku.sku}>
                  <TableCell className="font-mono text-xs">{sku.sku}</TableCell>
                  <TableCell>{Object.values(sku.variantOptions).join(' / ')}</TableCell>
                  <TableCell><Input type="number" value={sku.price} onChange={e => handleSkuPriceChange(skuIndex, e.target.value)} placeholder="Base Price" /></TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        {step > 1 && <Button type="button" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Previous</Button>}
        {step < totalSteps && <Button type="button" onClick={nextStep}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>}
        {step === totalSteps && (
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : (productId ? 'Update Product' : 'Save Product')}</Button>
            {productId && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default ProductForm;