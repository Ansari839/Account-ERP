import mongoose from "mongoose";
import Account from "./Account"; // Ensure Account model is imported

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
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'referenceModel'
  },
  referenceModel: {
    type: String,
    enum: ['PurchaseInvoice', 'Sale', 'Payment', 'Receipt']
  }
}, { timestamps: true });

// Middleware to update account balances after a journal entry is saved
JournalEntrySchema.post('save', async function (doc, next) {
  try {
    for (const detail of doc.details) {
      const { account, debit, credit } = detail;
      
      // Find the account to update
      const accountToUpdate = await Account.findById(account);
      if (!accountToUpdate) {
        console.error(`Account with ID ${account} not found.`);
        continue; // Or throw an error
      }

      // Determine the type of account to correctly update the balance
      const accountType = accountToUpdate.type;
      let balanceChange = 0;

      if (['Asset', 'Expense'].includes(accountType)) {
        balanceChange = debit - credit;
      } else if (['Liability', 'Capital', 'Income'].includes(accountType)) {
        balanceChange = credit - debit;
      }

      // Update the account's balance
      await Account.updateOne(
        { _id: account },
        { $inc: { balance: balanceChange } }
      );
    }
    next();
  } catch (error) {
    console.error("Error updating account balances:", error);
    next(error);
  }
});

export default mongoose.models.JournalEntry || mongoose.model("JournalEntry", JournalEntrySchema);