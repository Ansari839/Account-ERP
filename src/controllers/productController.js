import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Warehouse from "@/models/Warehouse";
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
      })
      .populate('category');
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
    if (productData.account) delete productData.account; // Remove unnecessary data
    const product = await Product.create(productData);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

// GET product by ID
export const getProductById = async (id) => {
  await dbConnect();
  try {
    const product = await Product.findById(id)
      .populate({
        path: "skus.stockByWarehouse.warehouse",
        strictPopulate: false,
      });
    if (!product) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

// UPDATE product
export const updateProduct = async (id, req) => {
  await dbConnect();
  try {
    const body = await req.json();
    const updatedProduct = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

// DELETE product
export const deleteProduct = async (id) => {
  await dbConnect();
  try {
    const deletedProduct = await Product.deleteOne({ _id: id });
    if (!deletedProduct.deletedCount)
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};
