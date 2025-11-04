import StockEntry from "@/models/StockEntry";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export const createStockEntry = async (req) => {
  try {
    await dbConnect();
    const body = await req.json();

    const stockEntry = await StockEntry.create({
      product: body.product,
      warehouse: body.warehouse,
      account: body.account,
      quantity: body.quantity,
      totalValue: body.totalValue,
      type: body.type || "IN",
      note: body.note || "",
    });

    return NextResponse.json({ success: true, data: stockEntry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
};