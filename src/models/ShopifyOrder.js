import mongoose from 'mongoose';

const ShopifyOrderSchema = new mongoose.Schema({
  shopifyOrderId: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  products: [
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
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "Online"],
  },
}, { timestamps: true });

export default mongoose.models.ShopifyOrder || mongoose.model('ShopifyOrder', ShopifyOrderSchema);
