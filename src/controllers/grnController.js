import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Grn from '@/models/Grn';
import Product from '@/models/Product';
import StockEntry from '@/models/StockEntry';
import { NextResponse } from 'next/server';

export const createGrn = async (req) => {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const body = await req.json();
    const { date, items, notes, createdBy, account } = body;

    if (!account) {
      return NextResponse.json({ success: false, message: 'Account is required' }, { status: 400 });
    }

    for (const item of items) {
      if (item.quantity <= 0) {
        return NextResponse.json({ success: false, message: `Invalid quantity for product SKU ${item.sku}. Quantity must be greater than 0.` }, { status: 400 });
      }
      if (item.cost < 0) {
        return NextResponse.json({ success: false, message: `Invalid cost for product SKU ${item.sku}. Cost cannot be negative.` }, { status: 400 });
      }
    }

    const processedItems = items.map(item => ({
      ...item,
      totalValue: Number(item.quantity) * Number(item.cost),
    }));

    const grnData = new Grn({ date, items: processedItems, notes, createdBy, account });
    const [newGrn] = await Grn.create([grnData], { session });

    for (const item of processedItems) {
      const stockEntryData = {
        product: item.product,
        sku: item.sku,
        warehouse: item.warehouse,
        quantity: item.quantity,
        totalValue: item.totalValue,
        type: 'IN',
        account,
        reference: newGrn._id,
      };
      await StockEntry.create([stockEntryData], { session });

      const product = await Product.findById(item.product).session(session);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found.`);
      }
      
      const sku = product.skus.find(s => s.sku === item.sku);
      if (sku) {
        const warehouseStock = sku.stockByWarehouse.find(w => w.warehouse.toString() === item.warehouse);
        if (warehouseStock) {
          warehouseStock.qty += item.quantity;
        } else {
          sku.stockByWarehouse.push({ warehouse: item.warehouse, qty: item.quantity });
        }
      } else {
        throw new Error(`SKU ${item.sku} not found for product ${product.name}.`);
      }
      await product.save({ session });
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true, data: newGrn }, { status: 201 });
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction aborted:", error);
    return NextResponse.json({ success: false, message: `Internal Server Error: ${error.message}` }, { status: 500 });
  } finally {
    session.endSession();
  }
};

export const getAllGrns = async () => {
  await dbConnect();
  const grns = await Grn.find().populate('items.product').populate('items.warehouse').populate('createdBy');
  return grns;
};

export const getGrnByCode = async (code) => {
  await dbConnect();
  const grn = await Grn.findOne({ grnCode: code }).populate('items.product').populate('items.warehouse').populate('createdBy');
  return grn;
};

export const deleteGrnByCode = async (code) => {
  await dbConnect();
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const grn = await Grn.findOne({ grnCode: code }).session(session);
    if (!grn) {
      throw new Error('GRN not found');
    }

    for (const item of grn.items) {
      const product = await Product.findById(item.product).session(session);
      if (product) {
        const sku = product.skus.find(s => s.sku === item.sku);
        if (sku) {
          const warehouseStock = sku.stockByWarehouse.find(w => w.warehouse.toString() === item.warehouse.toString());
          if (warehouseStock) {
            warehouseStock.qty -= item.quantity;
          }
        }
        await product.save({ session });
      }
    }

    await StockEntry.deleteMany({ reference: grn._id }).session(session);
    await Grn.deleteOne({ _id: grn._id }).session(session);

    await session.commitTransaction();
    return { message: 'GRN deleted successfully' };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
