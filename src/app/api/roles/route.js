import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Fetch all roles" });
}

export async function POST() {
  return NextResponse.json({ message: "Create new role" });
}
