import mongoose from "mongoose";

const milestoneVerificationSchema = new mongoose.Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "AidTransaction" },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  milestone: { type: String, required: true },
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending"
  },
  timestamp: { type: Date, default: Date.now },
  remarks: String
});

export default mongoose.model("MilestoneVerification", milestoneVerificationSchema);
