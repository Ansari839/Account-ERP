import mongoose from 'mongoose';
import dbConnect from "@/lib/dbConnect";
import Account from "@/models/Account";
import { NextResponse } from "next/server";

// 1. Get all accounts
export async function getAccounts(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    let filter = {};
    if (category) {
      filter.category = category;
    }

    const accounts = await Account.find(filter).populate('parent', 'name');
    return NextResponse.json({ success: true, data: accounts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. Create a new account
export async function createAccount(req) {
  try {
    await dbConnect();
    const { name, parent, type, openingDebit, openingCredit, category } = await req.json();
    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    // Auto-generate account code
    const lastAccount = await Account.findOne().sort({ code: -1 });
    let newCode = "ACC-0001";
    if (lastAccount && lastAccount.code) {
      const lastCode = parseInt(lastAccount.code.split("-")[1]);
      newCode = `ACC-${(lastCode + 1).toString().padStart(4, "0")}`;
    }

    let openingBalance = 0;
    let openingType = 'Debit';

    if (openingDebit > 0) {
      openingBalance = openingDebit;
      openingType = 'Debit';
    } else if (openingCredit > 0) {
      openingBalance = openingCredit;
      openingType = 'Credit';
    }

    const account = await Account.create({
      code: newCode,
      name,
      parent: parent || null, // Ensure parent is null if not provided
      type,
      openingBalance,
      openingType,
      category,
    });
    return NextResponse.json({ success: true, data: account }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 3. Update an existing account
export async function updateAccount(req, context) {
  await dbConnect();

  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid account ID format' }, { status: 400 });
  }

  const data = await req.json();
  
  if ('openingDebit' in data || 'openingCredit' in data) {
    if (data.openingDebit > 0) {
      data.openingBalance = data.openingDebit;
      data.openingType = 'Debit';
    } else if (data.openingCredit > 0) {
      data.openingBalance = data.openingCredit;
      data.openingType = 'Credit';
    } else {
      data.openingBalance = 0;
    }
    delete data.openingDebit;
    delete data.openingCredit;
  }


  const account = await Account.findByIdAndUpdate(id, data, { new: true });
  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: account }, { status: 200 });
}

// 4. Delete an account
export async function deleteAccount(req, context) {
  await dbConnect();

  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid account ID' }, { status: 400 });
  }

  const deletedAccount = await Account.findByIdAndDelete(id);
  if (!deletedAccount) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, message: 'Account deleted successfully' }, { status: 200 });
}