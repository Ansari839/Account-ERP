import { NextResponse } from 'next/server';
import { getGrnByCode, deleteGrnByCode } from '@/controllers/grnController';

// Get a single GRN by grnCode
export async function GET(request, { params }) {
  try {
    const grn = await getGrnByCode(params.code);
    if (!grn) {
      return NextResponse.json({ message: 'GRN not found' }, { status: 404 });
    }
    return NextResponse.json(grn);
  } catch (error) {
    console.error('Error fetching GRN:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete a GRN by grnCode
export async function DELETE(request, { params }) {
  try {
    const result = await deleteGrnByCode(params.code);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting GRN:', error);
    if (error.message === 'GRN not found') {
      return NextResponse.json({ message: 'GRN not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
