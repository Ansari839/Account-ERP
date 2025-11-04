import dbConnect from "@/lib/dbConnect";
import FiscalYear from "@/models/FiscalYear";
import Account from "@/models/Account";
import JournalEntry from "@/models/JournalEntry";
import { NextResponse } from "next/server";

export async function setActiveYear(yearId) {
  // Placeholder for setting the active fiscal year
  console.log(`Setting active fiscal year to: ${yearId}`);
  return NextResponse.json({ message: `Active fiscal year set to ${yearId}` });
}

/**
 * Get all fiscal years
 */
export async function getFiscalYears() {
  try {
    await dbConnect();
    const years = await FiscalYear.find().populate("company").sort({ startDate: -1 });
    return NextResponse.json(years);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Create fiscal year
 * body: { name, startDate, endDate, company }
 */
export async function createFiscalYear(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const fy = await FiscalYear.create(body);
    return NextResponse.json(fy);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


/**
 * Close fiscal year by id
 */
export async function closeFiscalYear(id) {
  try {
    await dbConnect();
    const fiscalYear = await FiscalYear.findById(id);
    if (!fiscalYear) {
      return NextResponse.json({ error: "Fiscal year not found" }, { status: 404 });
    }
    if (fiscalYear.status === "Closed") {
      return NextResponse.json({ error: "Fiscal year is already closed" }, { status: 400 });
    }

    const incomeAccounts = await Account.find({ fiscalYear: id, type: "Income" });
    const expenseAccounts = await Account.find({ fiscalYear: id, type: "Expense" });

    const totalIncome = incomeAccounts.reduce((acc, account) => acc + account.openingBalance, 0);
    const totalExpense = expenseAccounts.reduce((acc, account) => acc + account.openingBalance, 0);

    const profit = totalIncome - totalExpense;

    let retainedEarningsAccount = await Account.findOne({ name: "Retained Earnings", fiscalYear: id });
    if (!retainedEarningsAccount) {
      retainedEarningsAccount = await Account.create({
        name: "Retained Earnings",
        type: "Capital",
        fiscalYear: id,
        company: fiscalYear.company,
      });
    }

    const journalEntry = {
      date: new Date(),
      memo: "Closing entry for fiscal year " + fiscalYear.name,
      fiscalYear: id,
      details: [],
    };

    if (profit > 0) {
      journalEntry.details.push({ account: retainedEarningsAccount._id, credit: profit });
    } else {
      journalEntry.details.push({ account: retainedEarningsAccount._id, debit: -profit });
    }

    for (const account of incomeAccounts) {
      journalEntry.details.push({ account: account._id, debit: account.openingBalance });
    }

    for (const account of expenseAccounts) {
      journalEntry.details.push({ account: account._id, credit: account.openingBalance });
    }

    await JournalEntry.create(journalEntry);

    fiscalYear.status = "Closed";
    await fiscalYear.save();

    return NextResponse.json({ message: "Fiscal year closed successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}