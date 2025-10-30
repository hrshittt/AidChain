const mongoose = require('mongoose');

// Donation schema: stores on-chain tx reference plus metadata
const DonationSchema = new mongoose.Schema({
  txHash: { type: String, required: true, unique: true },
  donorAddr: { type: String, required: true },
  purpose: { type: String, required: true },
  amount: { type: String, required: true },
  // Optional: address of NGO assigned to manage this batch
  assignedTo: { type: String, required: false, index: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Donation', DonationSchema);
