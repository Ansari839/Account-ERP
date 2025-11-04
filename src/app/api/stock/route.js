import { createStockEntry } from "@/controllers/stockController";

export async function POST(req) {
  return createStockEntry(req);
}