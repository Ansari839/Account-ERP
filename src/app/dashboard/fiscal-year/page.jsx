"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import CompanyHeader from "@/components/layout/CompanyHeader";

export default function FiscalYearPage() {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [activationKey, setActivationKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    fetchCompany();
    fetchYears();
  }, []);

  async function fetchCompany() {
    try {
      const res = await fetch("/api/company");
      const data = await res.json();
      setCompany(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchYears() {
    try {
      const res = await fetch("/api/fiscal-year");
      const data = await res.json();
      setYears(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function closeYear() {
    if (!selectedYear) return;
    setIsClosing(true);
    try {
      await axios.post(`/api/fiscal-year/close/${selectedYear._id}`);
      fetchYears();
      fetchCompany();
    } catch (err) {
      console.error(err);
    } finally {
      setIsClosing(false);
      setSelectedYear(null);
    }
  }

  async function verifyKey() {
    setIsVerifying(true);
    try {
      await axios.post("/api/license/verify", {
        companyId: company._id,
        fiscalYear: new Date().getFullYear(),
        key: activationKey,
      });
      fetchCompany();
      setShowActivationModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="p-6">
      <CompanyHeader />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fiscal Year Management</h1>
        <div>
          {company?.fiscalLock ? (
            <div className="flex items-center space-x-2">
              <p className="text-red-500">
                Contact Provider for Activation Key
              </p>
              <Button onClick={() => setShowActivationModal(true)}>
                Start New Year
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/fiscal-year/new">Add New Fiscal Year</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {years.map((y) => (
              <TableRow key={y._id}>
                <TableCell>{y.name}</TableCell>
                <TableCell>{y.company?.name}</TableCell>
                <TableCell>
                  {new Date(y.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(y.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      y.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {y.status}
                  </span>
                </TableCell>
                <TableCell>
                  {y.status === "active" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => setSelectedYear(y)}
                        >
                          Close Year
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This will close the fiscal year and generate the
                            closing journal entry. This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedYear(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={closeYear}
                            disabled={isClosing}
                          >
                            {isClosing ? "Closing..." : "Confirm"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showActivationModal} onOpenChange={setShowActivationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Activation Key</DialogTitle>
            <DialogDescription>
              Enter the activation key provided by your software provider to
              start a new fiscal year.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activation-key" className="text-right">
                Activation Key
              </Label>
              <Input
                id="activation-key"
                value={activationKey}
                onChange={(e) => setActivationKey(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowActivationModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={verifyKey} disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}