"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGrnStore from '@/store/grnStore';

const GrnDetailsModal = ({ grn, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGrn, setEditedGrn] = useState(grn);

  useEffect(() => {
    setEditedGrn(grn);
  }, [grn]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'quantity' || name === 'cost') {
      const newItems = [...editedGrn.items];
      newItems[index][name] = value;
      setEditedGrn({ ...editedGrn, items: newItems });
    } else {
      setEditedGrn({ ...editedGrn, [name]: value });
    }
  };

  const handleSave = async () => {
    try {
      await onUpdate(editedGrn);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update GRN", error);
    }
  };

  if (!grn) return null;

  return (
    <Dialog open={!!grn} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>GRN Details - {grn.grnCode}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <div className="font-semibold">Date</div>
            <Input value={new Date(editedGrn.date).toLocaleDateString()} disabled />
          </div>
          <div>
            <Label>Items</Label>
            {editedGrn.items.map((item, index) => (
              <div key={item._id} className="grid grid-cols-3 gap-2 mb-2">
                <Input value={item.product.name} disabled />
                <Input
                  name="quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChange(e, index)}
                  disabled={!isEditing}
                />
                <Input
                  name="cost"
                  type="number"
                  value={item.cost}
                  onChange={(e) => handleChange(e, index)}
                  disabled={!isEditing}
                />
              </div>
            ))}
          </div>
          <div>
            <Label>Notes</Label>
            <Input
              name="notes"
              value={editedGrn.notes}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>
        <DialogFooter>
          {isEditing ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={handleEditToggle}>Edit</Button>
          )}
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GrnDetailsModal;
