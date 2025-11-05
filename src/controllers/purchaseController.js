import dbConnect from '@/lib/dbConnect';
import Purchase from '@/models/Purchase';
import Company from '@/models/Company';
import FiscalYear from '@/models/FiscalYear';

export const createPurchase = async (data) => {
  await dbConnect();
  const { transactionDate, ...purchaseData } = data;
  const company = await Company.findOne();
  if (!company) {
    throw new Error('Company not found');
  }

  if (company.fiscalLock) {
    throw new Error('Fiscal year is locked');
  }

  const fiscalYear = await FiscalYear.findById(company.currentFiscalYear);
  if (!fiscalYear) {
    throw new Error('Fiscal year not found');
  }

  const txDate = new Date(transactionDate);
  if (txDate < fiscalYear.startDate || txDate > fiscalYear.endDate) {
    throw new Error('Transaction date is outside the fiscal year');
  }

  const newPurchase = new Purchase({
    ...purchaseData,
    transactionDate,
    company: company._id,
  });

  await newPurchase.save();
  return newPurchase;
};

export const getAllPurchases = async () => {
  await dbConnect();
  const purchases = await Purchase.find({});
  return purchases;
};
