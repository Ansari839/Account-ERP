import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

export async function GET(request) {
  await dbConnect();

  try {
    // Find an account to add transactions to. Let's use the first account we find.
    const account = await Account.findOne();
    if (!account) {
      return NextResponse.json({ success: false, message: 'No account found to add transactions to.' }, { status: 404 });
    }

    // Create a debit transaction
    await Transaction.create({
      account: account._id,
      type: 'debit',
      amount: 100,
      description: 'Test debit transaction',
    });

    // Create a credit transaction
    await Transaction.create({
      account: account._id,
      type: 'credit',
      amount: 50,
      description: 'Test credit transaction',
    });

    return NextResponse.json({ success: true, message: 'Test transactions created successfully.' });
  } catch (error) {
    console.error("Error creating test transactions:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}