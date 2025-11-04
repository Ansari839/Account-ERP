
import mongoose from 'mongoose';

const WarehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  location: {
    type: String,
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

export default mongoose.models.Warehouse || mongoose.model('Warehouse', WarehouseSchema);
