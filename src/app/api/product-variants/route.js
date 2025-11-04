import { createVariant, getVariants } from '@/controllers/productVariant.controller';

export async function GET() {
  return getVariants();
}

export async function POST(req) {
  return createVariant(req);
}
