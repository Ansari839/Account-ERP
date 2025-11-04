import dbConnect from '@/lib/dbConnect';
import ProductCategory from '@/models/ProductCategory';
import { generateProductCategoryCode } from '@/lib/generateProductCategoryCode';

export async function createCategory(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { name, description } = body;
    const transactionCode = await generateProductCategoryCode();
    const category = await ProductCategory.create({ name, description, transactionCode });
    return new Response(JSON.stringify({ success: true, data: category }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function getCategories() {
  await dbConnect();
  try {
    const categories = await ProductCategory.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify({ success: true, data: categories }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function getCategoryById(req, { params }) {
  await dbConnect();
  try {
    const category = await ProductCategory.findById(params.id);
    if (!category) {
      return new Response(JSON.stringify({ success: false, message: 'Category not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: category }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function updateCategory(req, { params }) {
  await dbConnect();
  try {
    const data = await req.json();
    const category = await ProductCategory.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return new Response(JSON.stringify({ success: false, message: 'Category not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: category }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}

export async function deleteCategory(req, { params }) {
  await dbConnect();
  try {
    const deletedCategory = await ProductCategory.findByIdAndDelete(params.id);
    if (!deletedCategory) {
      return new Response(JSON.stringify({ success: false, message: 'Category not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: {} }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 });
  }
}
