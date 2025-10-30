import mongoose from "mongoose";

const aidTransactionSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    enum: ["donation", "allocation", "logistics", "delivery"],
    required: true
  },
  aidCategory: {
    type: String,
    enum: ["food", "medicine", "education", "clothing", "funds"],
    required: true
  },
  amount: Number,
  status: {
    type: String,
    enum: ["initiated", "in-progress", "completed", "failed"],
    default: "initiated"
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("AidTransaction", aidTransactionSchema);
