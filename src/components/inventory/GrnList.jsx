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

const GrnList = () => {
  const [grns, setGrns] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        const res = await fetch('/api/grn');
        const data = await res.json();
        setGrns(data);
      } catch (error) {
        console.error("Failed to fetch GRNs", error);
        toast.error("Failed to fetch GRNs");
      }
    };
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
    fetchGrns();
    fetchPurchases();
  }, []);

  const getBillStatus = (grnId) => {
    const purchase = purchases.find(p => p.grn === grnId);
    return purchase ? purchase.billStatus : 'Not Billed';
  };

  const handleDelete = async (grnCode) => {
    try {
      const res = await fetch(`/api/grn/${grnCode}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success("GRN deleted successfully");
        setGrns(grns.filter(grn => grn.grnCode !== grnCode));
      } else {
        toast.error("Failed to delete GRN");
      }
    } catch (error) {
      console.error("Failed to delete GRN", error);
      toast.error("Failed to delete GRN");
    }
  };

  return (
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
              <Button variant="ghost" size="icon">
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
  );
};

export default GrnList;
