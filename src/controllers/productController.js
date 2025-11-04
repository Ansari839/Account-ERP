import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Warehouse from '@/models/Warehouse';
import Account from '@/models/Account';
import { generateProductCode } from '@/lib/generateProductCode';
import { NextResponse } from 'next/server';

export const getProducts = async (req) => {
  await dbConnect();
  try {
    const products = await Product.find({}).populate('warehouse').populate('account');
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

export const createProduct = async (req) => {
  await dbConnect();
  try {
    const body = await req.json();
    const transactionCode = await generateProductCode();
    const productData = { ...body, transactionCode };
        console.log("🧩 Incoming Product Body:", productData); 
    const { warehouse, account } = body;

    const warehouseExists = await Warehouse.findById(warehouse);
    if (!warehouseExists) {
      return NextResponse.json({ success: false, message: 'Warehouse not found' }, { status: 404 });
    }

    const accountExists = await Account.findById(account);
    if (!accountExists) {
      return NextResponse.json({ success: false, message: 'Account not found' }, { status: 404 });
    }

    const product = await Product.create(productData);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

export const getProductById = async (req, { params }) => {
  await dbConnect();
  try {
    const product = await Product.findById(params.id).populate('warehouse').populate('account');
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
  return NextResponse.json({ success: false, message: error.message }, { status: 400 });
}

};

export const updateProduct = async (req, { params }) => {
  await dbConnect();
  try {
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

export const deleteProduct = async (req, { params }) => {
  await dbConnect();
  try {
    const deletedProduct = await Product.deleteOne({ _id: params.id });
    if (deletedProduct.deletedCount === 0) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};