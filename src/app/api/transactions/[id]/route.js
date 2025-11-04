import { getTransactionById, updateTransaction, deleteTransaction } from '@/controllers/transaction.controller';

export async function GET(req, { params }) {
  return getTransactionById(req, { params });
}

export async function PUT(req, { params }) {
  return updateTransaction(req, { params });
}

export async function DELETE(req, { params }) {
  return deleteTransaction(req, { params });
}
