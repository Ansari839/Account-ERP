"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Eye, Trash2 } from 'lucide-react';
import useGrnStore from '@/store/grnStore';
import GrnDetailsModal from './GrnDetailsModal';

const GrnList = () => {
  const { grns, fetchGrns, removeGrn, updateGrn } = useGrnStore();
  const [purchases, setPurchases] = useState([]);
  const [selectedGrn, setSelectedGrn] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGrns();
    const fetchPurchases = async () => {
      try {
        const res = await fetch('/api/purchases');
        const data = await res.json();
        setPurchases(data);
      } catch (error) {
        console.error("Failed to fetch purchases", error);
        toast.error("Failed to fetch purchases");
      }
    };
    fetchPurchases();
  }, [fetchGrns]);

  const getBillStatus = (grnId) => {
    const purchase = purchases.find(p => p.grn === grnId);
    return purchase ? purchase.billStatus : 'Not Billed';
  };

  const handleDelete = async (grnCode) => {
    console.log("Deleting GRN with code:", grnCode);
    try {
      await removeGrn(grnCode);
    } catch (error) {
      console.error("Failed to delete GRN", error);
    }
  };

  const handleView = (grn) => {
    setSelectedGrn(grn);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGrn(null);
  };

  const handleUpdateGrn = async (updatedGrn) => {
    try {
      await updateGrn(updatedGrn.grnCode, updatedGrn);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update GRN", error);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>GRN Code</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grns.map((grn) => (
            <TableRow key={grn._id}>
              <TableCell>{grn.grnCode}</TableCell>
              <TableCell>{new Date(grn.date).toLocaleDateString()}</TableCell>
              <TableCell>{grn.items.length}</TableCell>
              <TableCell>
                <Badge>{getBillStatus(grn._id)}</Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleView(grn)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(grn.grnCode)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && (
        <GrnDetailsModal
          grn={selectedGrn}
          onClose={handleCloseModal}
          onUpdate={handleUpdateGrn}
        />
      )}
    </>
  );
};

export default GrnList;
