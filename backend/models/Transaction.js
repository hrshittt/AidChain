const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema({
  aidId: { type: Number, required: true, unique: true },
  donor: String,
  donorName: String,
  donorAddress: String,
  ngo: String,
  ngoName: String,
  beneficiary: String,
  amount: String,
  purpose: String,
  delivered: Boolean,
  onChainTimestamp: String,
  confirmedAt: Date,
  txHash: String
}, { timestamps: { createdAt: true, updatedAt: false }});

module.exports = mongoose.model("Transaction", TransactionSchema);
