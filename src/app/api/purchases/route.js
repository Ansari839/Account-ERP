import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Company from '@/models/Company';
import FiscalYear from '@/models/FiscalYear';
import Purchase from '@/models/Purchase';

export async function POST(req) {
  await dbConnect();

  try {
    const { transactionDate, ...purchaseData } = await req.json();
    const company = await Company.findOne();
    if (!company) {
      return new NextResponse('Company not found', { status: 404 });
    }

    if (company.fiscalLock) {
      return new NextResponse('Fiscal year is locked', { status: 403 });
    }

    const fiscalYear = await FiscalYear.findById(company.currentFiscalYear);
    if (!fiscalYear) {
      return new NextResponse('Fiscal year not found', { status: 404 });
    }

    const txDate = new Date(transactionDate);
    if (txDate < fiscalYear.startDate || txDate > fiscalYear.endDate) {
      return new NextResponse('Transaction date is outside the fiscal year', { status: 400 });
    }

    const newPurchase = new Purchase({
      ...purchaseData,
      transactionDate,
      company: company._id,
    });

    await newPurchase.save();

    return new NextResponse(JSON.stringify(newPurchase), { status: 201 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Fetch all purchases" });
}
