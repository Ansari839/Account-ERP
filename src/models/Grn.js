import mongoose from 'mongoose';
import { generateGrnCode } from '@/lib/generateGrnCode';

const GrnItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  cost: {
    type: Number,
    required: true,
  },
  totalValue: {
    type: Number,
    required: true,
  },
});

const GrnSchema = new mongoose.Schema({
  grnCode: {
    type: String,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  items: [GrnItemSchema],
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  notes: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

GrnSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.grnCode = await generateGrnCode();
  }
  next();
});

export default mongoose.models.Grn || mongoose.model('Grn', GrnSchema);
