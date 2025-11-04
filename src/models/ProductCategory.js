import mongoose from 'mongoose';

const ProductCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
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

export default mongoose.models.ProductCategory || mongoose.model('ProductCategory', ProductCategorySchema);
