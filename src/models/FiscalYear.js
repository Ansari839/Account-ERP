import mongoose from "mongoose";

const FiscalYearSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  name: { type: String, required: true }, // e.g. "FY 2025-26"
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String, enum: ['active','closed'], default: 'active' },
  closingJV: { type: mongoose.Schema.Types.ObjectId, ref: 'JournalEntry' }
}, { timestamps: true });

export default mongoose.models.FiscalYear || mongoose.model("FiscalYear", FiscalYearSchema);