import { NextResponse } from 'next/server';
import { getGrnByCode, deleteGrnByCode, updateGrnByCode } from '@/controllers/grnController';

// Get a single GRN by grnCode
export async function GET(request, { params }) {
  try {
    const { code } = await params;
    const grn = await getGrnByCode(code);
    if (!grn) {
      return NextResponse.json({ message: 'GRN not found' }, { status: 404 });
    }
    return NextResponse.json(grn);
  } catch (error) {
    console.error('Error fetching GRN:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Update a GRN by grnCode
export async function PUT(request, { params }) {
  try {
    const { code } = await params;
    const body = await request.json();
    const updatedGrn = await updateGrnByCode(code, body);
    return NextResponse.json({ success: true, data: updatedGrn });
  } catch (error) {
    console.error('Error updating GRN:', error);
    if (error.message === 'GRN not found') {
      return NextResponse.json({ message: 'GRN not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Delete a GRN by grnCode
export async function DELETE(request, { params }) {
  try {
    const { code } = await params;
    const result = await deleteGrnByCode(code);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting GRN:', error);
    if (error.message === 'GRN not found') {
      return NextResponse.json({ message: 'GRN not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
