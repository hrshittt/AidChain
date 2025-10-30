const mongoose = require('mongoose');

// Evidence model: links uploaded media (IPFS) to a batch and agent
const EvidenceSchema = new mongoose.Schema({
  batchId: { type: String, required: true },
  cid: { type: String, required: true },
  filename: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  timestamp: { type: Date },
  agentAddr: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Evidence', EvidenceSchema);
