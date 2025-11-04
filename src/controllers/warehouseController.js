import dbConnect from '@/lib/dbConnect';
import Warehouse from '@/models/Warehouse';
import { generateWarehouseCode } from '@/lib/generateWarehouseCode';

export async function createWarehouse(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { name, location, description } = body;
    const transactionCode = await generateWarehouseCode();
    const warehouse = await Warehouse.create({ name, location, description, transactionCode });
    return new Response(JSON.stringify({ success: true, data: warehouse }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function getWarehouses() {
  await dbConnect();
  try {
    const warehouses = await Warehouse.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify({ success: true, data: warehouses }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function getWarehouseById(req, { params }) {
  await dbConnect();
  try {
    const warehouse = await Warehouse.findById(params.id);
    if (!warehouse) {
      return new Response(JSON.stringify({ success: false, message: 'Warehouse not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: warehouse }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function updateWarehouse(req, { params }) {
  await dbConnect();
  try {
    const data = await req.json();
    const warehouse = await Warehouse.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!warehouse) {
      return new Response(JSON.stringify({ success: false, message: 'Warehouse not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: warehouse }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function deleteWarehouse(req, { params }) {
  await dbConnect();
  try {
    const deletedWarehouse = await Warehouse.findByIdAndDelete(params.id);
    if (!deletedWarehouse) {
      return new Response(JSON.stringify({ success: false, message: 'Warehouse not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: {} }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}