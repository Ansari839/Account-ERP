import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Fetch all customers" });
}

export async function POST() {
  return NextResponse.json({ message: "Create new customer" });
}
