import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Draft", "Confirmed", "Cancelled"],
    default: "Draft",
  },
  grn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grn",
  },
  billStatus: {
    type: String,
    enum: ["Pending", "Billed"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "Online"],
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
