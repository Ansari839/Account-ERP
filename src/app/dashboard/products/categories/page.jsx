"use client";
import CategoryList from "@/components/products/CategoryList";

const CategoriesPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Categories</h1>
      <CategoryList />
    </div>
  );
};

export default CategoriesPage;