import { createTransaction, getAllTransactions } from '@/controllers/transaction.controller';

export async function POST(req) {
  return createTransaction(req);
}

export async function GET() {
  return getAllTransactions();
}