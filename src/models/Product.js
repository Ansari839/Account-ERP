import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  transactionCode: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory',
  },
  skus: [{
    sku: { type: String, unique: true }, // e.g., TSHIRT-RED-M
    variantOptions: { type: Map, of: String }, // e.g., { "Size": "Small", "Color": "Red" }
    price: Number, // Optional, overrides base price
    stockByWarehouse: [{
      warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
      qty: { type: Number, required: true, default: 0 }
    }],
  }],
}, { timestamps: true });

console.log("Product Schema Definition:", ProductSchema.paths);
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
