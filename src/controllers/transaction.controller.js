import dbConnect from '@/lib/dbConnect';
import Transaction from '@/models/Transaction';
import Account from '@/models/Account';

async function generateTransactionCode(type) {
  const prefixes = {
    "sale": "S",
    "purchase": "P",
    "cash_receive": "CR",
    "cash_paid": "CP",
  };
  const prefix = prefixes[type];
  if (!prefix) {
    throw new Error("Invalid transaction type");
  }

  const latestTransaction = await Transaction.findOne({
    transactionCode: { $regex: `^${prefix}\\d+$` }
  }).sort({ transactionCode: -1 });

  let nextId = 1;
  if (latestTransaction) {
    const lastId = parseInt(latestTransaction.transactionCode.substring(prefix.length));
    nextId = lastId + 1;
  }

  return `${prefix}${nextId}`;
}

export async function createTransaction(req) {
  await dbConnect();

  try {
    const { debitAccountId, creditAccountId, amount, description, transactionType } = await req.json();

    if (!debitAccountId || !creditAccountId || !amount || !transactionType) {
      return new Response(JSON.stringify({ success: false, message: 'Missing required fields' }), { status: 400 });
    }

    const debitAccount = await Account.findById(debitAccountId);
    if (!debitAccount) {
      return new Response(JSON.stringify({ success: false, message: 'Debit account not found' }), { status: 404 });
    }

    const creditAccount = await Account.findById(creditAccountId);
    if (!creditAccount) {
      return new Response(JSON.stringify({ success: false, message: 'Credit account not found' }), { status: 404 });
    }

    const transactionCode = await generateTransactionCode(transactionType);

    const debitTransaction = new Transaction({
      accountId: debitAccountId,
      type: 'debit',
      amount,
      description,
      transactionCode,
      transactionType,
    });

    const creditTransaction = new Transaction({
      accountId: creditAccountId,
      type: 'credit',
      amount,
      description,
      transactionCode,
      transactionType,
    });

    await debitTransaction.save();
    await creditTransaction.save();

    return new Response(JSON.stringify({ success: true, data: { transactionCode, debitTransaction, creditTransaction } }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function getAllTransactions() {
  await dbConnect();

  try {
    const transactions = await Transaction.find({});
    return new Response(JSON.stringify({ success: true, data: transactions }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function getTransactionById(req, { params }) {
  await dbConnect();

  try {
    const transaction = await Transaction.findById(params.id);
    if (!transaction) {
      return new Response(JSON.stringify({ success: false, message: 'Transaction not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: transaction }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function updateTransaction(req, { params }) {
  await dbConnect();

  try {
    const transaction = await Transaction.findByIdAndUpdate(params.id, await req.json(), {
      new: true,
      runValidators: true,
    });
    if (!transaction) {
      return new Response(JSON.stringify({ success: false, message: 'Transaction not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: transaction }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function deleteTransaction(req, { params }) {
  await dbConnect();

  try {
    const deletedTransaction = await Transaction.deleteOne({ _id: params.id });
    if (deletedTransaction.deletedCount === 0) {
      return new Response(JSON.stringify({ success: false, message: 'Transaction not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: {} }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}
