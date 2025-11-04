import { getFiscalYears, createFiscalYear } from "@/controllers/fiscalController";

export async function GET() {
  return getFiscalYears();
}

export async function POST(req) {
  return createFiscalYear(req);
}