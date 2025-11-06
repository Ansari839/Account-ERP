import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import ProductCategory from "@/models/ProductCategory";
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
    const { productCode, name, category, price, skus } = body;
    
    const newProduct = new Product({ productCode, name, category, price, skus });
    await newProduct.save();
    
    return NextResponse.json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};

// GET product by ID
export const getProductById = async (id) => {
  await dbConnect();
  try {
    const product = await Product.findOne({ _id: id })
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
    const updatedProduct = await Product.findOneAndUpdate({ _id: id }, body, {
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
    const deletedProduct = await Product.findOneAndDelete({ _id: id });
    if (!deletedProduct)
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};
