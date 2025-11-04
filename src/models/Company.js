import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, default: "" }, // URL or base64
  ntn: { type: String, default: "" },
  address: { type: String, default: "" },
  contact: { type: String, default: "" },
  email: { type: String, default: "" },
  fiscalStart: { type: Date },
  fiscalEnd: { type: Date },
  currentFiscalYear: { type: String },
  fiscalLock: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);