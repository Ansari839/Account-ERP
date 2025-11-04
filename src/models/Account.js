import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    default: null,
  },
  type: {
    type: String,
    required: true,
    enum: ['Asset', 'Liability', 'Capital', 'Income', 'Expense'],
  },
  openingBalance: {
    type: Number,
    default: 0,
  },
  openingType: {
    type: String,
    enum: ['Debit', 'Credit'],
    default: 'Debit',
  },
  fiscalYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FiscalYear"
  },
  category: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model('Account', AccountSchema);