// src/app/api/products/[id]/route.js
import { getProductById, updateProduct, deleteProduct } from "@/controllers/productController";
import { isValidObjectId } from "mongoose";

export async function GET(req, { params }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid product ID" }), { status: 400 });
  }
  return getProductById(id);
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid product ID" }), { status: 400 });
  }
  return updateProduct(id, req);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return new Response(JSON.stringify({ success: false, message: "Invalid product ID" }), { status: 400 });
  }
  return deleteProduct(id);
}
