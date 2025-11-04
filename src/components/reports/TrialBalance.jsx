'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACCOUNT_NATURES = ['Asset', 'Liability', 'Capital', 'Income', 'Expense'];

const TrialBalance = () => {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState({ debit: 0, credit: 0 });
  const [selectedNature, setSelectedNature] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let url = '/api/reports/trial-balance';
        if (selectedNature && selectedNature !== 'all') {
          url += `?nature=${selectedNature}`;
        }
        const res = await fetch(url);
        const json = await res.json();

        if (json.success) {
          setData(json.data);
          setTotals(json.totals);
        } else {
          throw new Error(json.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedNature]);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Trial Balance</CardTitle>
          <div className="w-[180px]">
            <Select value={selectedNature} onValueChange={setSelectedNature}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by nature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Natures</SelectItem>
                {ACCOUNT_NATURES.map((nature) => (
                  <SelectItem key={nature} value={nature}>
                    {nature}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Code</TableHead>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Nature</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>{item.accountId}</TableCell>
                    <TableCell>{item.accountName}</TableCell>
                    <TableCell>{item.nature}</TableCell>
                    <TableCell className="text-right">{item.closingDebit.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.closingCredit.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="font-bold">
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">{totals.debit.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{totals.credit.toFixed(2)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrialBalance;