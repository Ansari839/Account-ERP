import { NextResponse } from 'next/server';
import { createPurchase, getAllPurchases } from '@/controllers/purchaseController';

export async function POST(req) {
  try {
    const body = await req.json();
    const newPurchase = await createPurchase(body);
    return new NextResponse(JSON.stringify(newPurchase), { status: 201 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function GET() {
  try {
    const purchases = await getAllPurchases();
    return NextResponse.json(purchases);
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}
