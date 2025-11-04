import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";
import FiscalYear from "@/models/FiscalYear";
import Account from "@/models/Account";
import JournalEntry from "@/models/JournalEntry";

export async function POST(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const company = await Company.findOne(); // Assuming single company
    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    const fiscalYear = await FiscalYear.findById(id);
    if (!fiscalYear) {
      return new NextResponse("Fiscal year not found", { status: 404 });
    }

    if (fiscalYear.status === 'closed') {
      return new NextResponse("Fiscal year is already closed", { status: 400 });
    }

    const incomeAccounts = await Account.find({ type: 'Income' });
    const expenseAccounts = await Account.find({ type: 'Expense' });

    let totalIncome = 0;
    for (const acc of incomeAccounts) {
      totalIncome += acc.balance;
    }

    let totalExpense = 0;
    for (const acc of expenseAccounts) {
      totalExpense += acc.balance;
    }

    const retainedEarningsAccount = await Account.findOne({ name: 'Retained Earnings' });
    if (!retainedEarningsAccount) {
      return new NextResponse("Retained Earnings account not found", { status: 404 });
    }

    const netProfit = totalIncome - totalExpense;

    const closingJV = new JournalEntry({
      company: company._id,
      date: fiscalYear.endDate,
      description: `Closing entry for fiscal year ${fiscalYear.name}`,
      entries: [
        ...incomeAccounts.map(acc => ({ account: acc._id, debit: acc.balance, credit: 0 })),
        ...expenseAccounts.map(acc => ({ account: acc._id, debit: 0, credit: acc.balance })),
        {
          account: retainedEarningsAccount._id,
          debit: netProfit < 0 ? -netProfit : 0,
          credit: netProfit > 0 ? netProfit : 0,
        }
      ]
    });

    await closingJV.save();

    for (const acc of [...incomeAccounts, ...expenseAccounts]) {
      acc.balance = 0;
      await acc.save();
    }

    fiscalYear.status = 'closed';
    fiscalYear.closingJV = closingJV._id;
    await fiscalYear.save();

    company.fiscalLock = true;
    await company.save();

    return new NextResponse(JSON.stringify(fiscalYear), { status: 200 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}