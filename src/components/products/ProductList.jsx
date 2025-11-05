"use client";
import { useEffect, useState } from "react";
import useProductStore from "@/store/productStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProductForm from "../ProductForm";
import { toast } from "sonner";

const ProductList = () => {
  const { products, loading, error, fetchProducts, addProduct, editProduct, removeProduct } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = () => { setSelectedProduct(null); setIsModalOpen(true); };
  const handleEdit = (product) => { setSelectedProduct(product); setIsModalOpen(true); };
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await removeProduct(id);
        toast.success("Product deleted successfully");
      } catch (err) {
        toast.error(err.message || "Failed to delete product");
        console.error("Delete Error:", err);
      }
    }
  };

  const handleSubmit = async (data) => {
    if (selectedProduct) {
      await editProduct(selectedProduct._id, data);
      toast.success("Product updated successfully");
    } else {
      await addProduct(data);
      toast.success("Product added successfully");
    }
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-end mb-4"><Button onClick={handleAdd}>Add New Product</Button></div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.transactionCode}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category?.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.skus.reduce((acc, sku) => acc + sku.stockByWarehouse.reduce((sAcc, w) => sAcc + w.qty, 0), 0)}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>Edit</Button>
                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDelete(product._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</DialogTitle></DialogHeader>
          <ProductForm onSubmit={handleSubmit} product={selectedProduct} onClose={() => setIsModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;
