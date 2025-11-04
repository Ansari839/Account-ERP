import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Account from '@/models/Account';
import Transaction from '@/models/Transaction';

export async function GET(request) {
  await dbConnect();

  try {
    const parentIds = await Account.find({ parent: { $ne: null } }).distinct('parent');

    const accounts = await Account.find({ _id: { $nin: parentIds } }).sort({ code: 1 });

    const transactions = await Transaction.aggregate([
      {
        $match: { accountId: { $ne: null } }
      },
      {
        $group: {
          _id: '$accountId',
          totalDebit: {
            $sum: { $cond: [{ $eq: ['$type', 'debit'] }, '$amount', 0] }
          },
          totalCredit: {
            $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0] }
          }
        }
      }
    ]);

    const transactionMap = new Map(transactions.map(t => [t._id.toString(), t]));

    let grandTotalDebit = 0;
    let grandTotalCredit = 0;

    const trialBalance = accounts.map(account => {
      const accountTransactions = transactionMap.get(account._id.toString()) || { totalDebit: 0, totalCredit: 0 };
      const { totalDebit, totalCredit } = accountTransactions;

      let closingBalance = 0;
      if (['Asset', 'Expense'].includes(account.type)) {
        closingBalance = account.openingBalance + totalDebit - totalCredit;
      } else {
        closingBalance = account.openingBalance + totalCredit - totalDebit;
      }

      let closingDebit = 0;
      let closingCredit = 0;

      if (['Asset', 'Expense'].includes(account.type)) {
        if (closingBalance >= 0) {
          closingDebit = closingBalance;
        } else {
          closingCredit = -closingBalance;
        }
      } else { // Liability, Capital, Income
        if (closingBalance >= 0) {
          closingCredit = closingBalance;
        } else {
          closingDebit = -closingBalance;
        }
      }
      
      grandTotalDebit += closingDebit;
      grandTotalCredit += closingCredit;

      return {
        _id: account._id,
        accountId: account.code,
        accountName: account.name,
        nature: account.type,
        closingDebit: closingDebit,
        closingCredit: closingCredit,
      };
    });

    return NextResponse.json({
      success: true,
      data: trialBalance,
      totals: {
        debit: grandTotalDebit,
        credit: grandTotalCredit,
      },
    });
  } catch (error) {
    console.error("Error generating trial balance:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
