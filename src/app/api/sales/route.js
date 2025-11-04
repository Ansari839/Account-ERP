import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Company from '@/models/Company';
import FiscalYear from '@/models/FiscalYear';
import Sale from '@/models/Sale';

export async function POST(req) {
  await dbConnect();

  try {
    const { transactionDate, ...saleData } = await req.json();
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

    const newSale = new Sale({
      ...saleData,
      transactionDate,
      company: company._id,
    });

    await newSale.save();

    return new NextResponse(JSON.stringify(newSale), { status: 201 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Fetch all sales" });
}
