import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { generateProductCode } from "@/lib/generateProductCode";
import { NextResponse } from "next/server";

// GET all products
export const getProducts = async () => {
  await dbConnect();
  try {
    const products = await Product.find({})
      .populate({
        path: "skus.stockByWarehouse.warehouse",
        strictPopulate: false,
      });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

// CREATE product
export const createProduct = async (req) => {
  await dbConnect();
  try {
    const body = await req.json();
    const transactionCode = await generateProductCode();
    const productData = { ...body, transactionCode };
    if (productData.account) delete productData.account;
    const product = await Product.create(productData);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

// GET product by ID
export const getProductById = async (req, { params }) => {
  await dbConnect();
  try {
    const product = await Product.findById(params.id)
      .populate({
        path: "skus.stockByWarehouse.warehouse",
        strictPopulate: false,
      });
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

// UPDATE product
export const updateProduct = async (req, { params }) => {
  await dbConnect();
  try {
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

// DELETE product
export const deleteProduct = async (req, { params }) => {
  await dbConnect();
  try {
    const deletedProduct = await Product.deleteOne({ _id: params.id });
    if (deletedProduct.deletedCount === 0)
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};
