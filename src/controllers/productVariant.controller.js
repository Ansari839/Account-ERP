import dbConnect from '@/lib/dbConnect';
import ProductVariant from '@/models/ProductVariant';
import { generateProductVariantCode } from '@/lib/generateProductVariantCode';

export async function createVariant(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { name, options, description } = body;
    const transactionCode = await generateProductVariantCode();
    const variant = await ProductVariant.create({ name, options, description, transactionCode });
    return new Response(JSON.stringify({ success: true, data: variant }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function getVariants() {
  await dbConnect();
  try {
    const variants = await ProductVariant.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify({ success: true, data: variants }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function getVariantById(req, { params }) {
  await dbConnect();
  try {
    const variant = await ProductVariant.findById(params.id);
    if (!variant) {
      return new Response(JSON.stringify({ success: false, message: 'Variant not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: variant }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function updateVariant(req, { params }) {
  await dbConnect();
  try {
    const data = await req.json();
    const variant = await ProductVariant.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!variant) {
      return new Response(JSON.stringify({ success: false, message: 'Variant not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: variant }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function deleteVariant(req, { params }) {
  await dbConnect();
  try {
    const deletedVariant = await ProductVariant.findByIdAndDelete(params.id);
    if (!deletedVariant) {
      return new Response(JSON.stringify({ success: false, message: 'Variant not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: {} }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}
