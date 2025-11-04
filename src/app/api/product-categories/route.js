import { createCategory, getCategories } from '@/controllers/productCategory.controller';

export async function GET() {
  return getCategories();
}

export async function POST(req) {
  return createCategory(req);
}
