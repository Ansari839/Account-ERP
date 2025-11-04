import mongoose from "mongoose";

const stockEntrySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
    account: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
    quantity: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    type: { type: String, enum: ["IN", "OUT"], default: "IN" },
    note: String,
  },
  { timestamps: true }
);

export default mongoose.models.StockEntry || mongoose.model("StockEntry", stockEntrySchema);