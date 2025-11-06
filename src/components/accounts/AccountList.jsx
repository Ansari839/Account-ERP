"use client";
import { useState, useEffect } from "react";
import useAccountStore from "@/store/useAccountStore";
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
import AccountForm from "@/components/forms/AccountForm";
import { toast } from "sonner";

const AccountList = () => {
  const { accounts, loading, error, fetchAccounts, addAccount, removeAccount } =
    useAccountStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleAdd = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (account) => {
    setEditData(account);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this account?")) {
      try {
        await removeAccount(id);
        toast.success("Account deleted successfully");
      } catch (err) {
        toast.error(err.message || "Failed to delete account");
        console.error("Delete Error:", err);
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editData) {
        // await updateAccount(editData._id, data);
        // toast.success("Account updated successfully");
      } else {
        await addAccount(data);
        toast.success("Account added successfully");
      }
      setIsModalOpen(false);
      fetchAccounts();
    } catch (error) {
      toast.error(error.message || "Failed to save account");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>Create Account</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Opening Balance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => (
            <TableRow key={account._id}>
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.parent?.name || "-"}</TableCell>
              <TableCell>{account.type}</TableCell>
              <TableCell>
                {new Intl.NumberFormat().format(account.openingBalance)}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(account)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="ml-2"
                  onClick={() => handleDelete(account._id)}
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
              {editData ? "Edit Account" : "Create New Account"}
            </DialogTitle>
          </DialogHeader>
          <AccountForm
            onSuccess={handleSubmit}
            editData={editData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountList;
