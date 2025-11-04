import mongoose from 'mongoose';

const ProductVariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
  },
  transactionCode: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

export default mongoose.models.ProductVariant || mongoose.model('ProductVariant', ProductVariantSchema);
