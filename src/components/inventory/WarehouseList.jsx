"use client";
import { useEffect, useState } from "react";
import useWarehouseStore from "@/store/warehouseStore";
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
import WarehouseForm from "./WarehouseForm";
import { toast } from "sonner";

const WarehouseList = () => {
  const {
    warehouses,
    loading,
    error,
    fetchWarehouses,
    addWarehouse,
    editWarehouse,
    removeWarehouse,
  } = useWarehouseStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const handleAdd = () => {
    setSelectedWarehouse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this warehouse?")) {
      await removeWarehouse(id);
      toast.success("Warehouse deleted successfully");
    }
  };

  const handleSubmit = async (data) => {
    if (selectedWarehouse) {
      await editWarehouse(selectedWarehouse._id, data);
      toast.success("Warehouse updated successfully");
    } else {
      await addWarehouse(data);
      toast.success("Warehouse added successfully");
    }
    setIsModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>Add New Warehouse</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warehouses.map((warehouse) => (
            <TableRow key={warehouse._id}>
              <TableCell>{warehouse.transactionCode}</TableCell>
              <TableCell>{warehouse.name}</TableCell>
              <TableCell>{warehouse.location}</TableCell>
              <TableCell>{warehouse.description}</TableCell>
              <TableCell>
                {new Date(warehouse.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(warehouse)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleDelete(warehouse._id)}
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
              {selectedWarehouse ? "Edit Warehouse" : "Add New Warehouse"}
            </DialogTitle>
          </DialogHeader>
          <WarehouseForm
            onSubmit={handleSubmit}
            warehouse={selectedWarehouse}
            onClose={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WarehouseList;