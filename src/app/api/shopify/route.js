import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Fetch all Shopify orders" });
}

export async function POST() {
  return NextResponse.json({ message: "Create new Shopify order" });
}
