import { NextResponse } from 'next/server';
import { createGrn, getAllGrns } from '@/controllers/grnController';

// Create a new GRN
export async function POST(request) {
  return createGrn(request);
}

// Get all GRNs
export async function GET() {
  try {
    const grns = await getAllGrns();
    return NextResponse.json(grns);
  } catch (error) {
    console.error('Error fetching GRNs:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
