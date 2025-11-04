"use client";
import { useEffect, useState } from "react";
import useProductVariantStore from "@/store/productVariantStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VariantForm from "./VariantForm";
import { toast } from "sonner";

const VariantList = () => {
  const {
    variants,
    loading,
    error,
    fetchVariants,
    addVariant,
    editVariant,
    removeVariant,
  } = useProductVariantStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  const handleAdd = () => {
    setSelectedVariant(null);
    setIsModalOpen(true);
  };

  const handleEdit = (variant) => {
    setSelectedVariant(variant);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this variant?")) {
      await removeVariant(id);
      toast.success("Variant deleted successfully");
    }
  };

  const handleSubmit = async (data) => {
    if (selectedVariant) {
      await editVariant(selectedVariant._id, data);
      toast.success("Variant updated successfully");
    } else {
      await addVariant(data);
      toast.success("Variant added successfully");
    }
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>Add New Variant</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Options</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map((variant) => (
            <TableRow key={variant._id}>
              <TableCell>{variant.transactionCode}</TableCell>
              <TableCell>{variant.name}</TableCell>
              <TableCell>{variant.options.join(', ')}</TableCell>
              <TableCell>
                {new Date(variant.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(variant)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleDelete(variant._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedVariant ? "Edit Variant" : "Add New Variant"}
            </DialogTitle>
          </DialogHeader>
          <VariantForm
            onSubmit={handleSubmit}
            variant={selectedVariant}
            onClose={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VariantList;
