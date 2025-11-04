import mongoose from "mongoose";

const JournalEntryDetailSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  debit: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
  },
});

const JournalEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  memo: {
    type: String,
    required: true,
  },
  details: [JournalEntryDetailSchema],
  fiscalYear: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FiscalYear",
    required: true,
  },
}, { timestamps: true });

export default mongoose.models.JournalEntry || mongoose.model("JournalEntry", JournalEntrySchema);
