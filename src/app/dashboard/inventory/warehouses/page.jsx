"use client";
import WarehouseList from "@/components/inventory/WarehouseList";

const WarehousesPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Warehouses</h1>
      <WarehouseList />
    </div>
  );
};

export default WarehousesPage;