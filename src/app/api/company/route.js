import { getCompany, createOrUpdateCompany } from "@/controllers/companyController";

export async function GET() {
  return getCompany();
}

export async function POST(req) {
  return createOrUpdateCompany(req);
}

export async function PUT(req) {
  return createOrUpdateCompany(req);
}