import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  action: { type: String, required: true }, // e.g. "CREATE_DONATION" "VERIFY_MILESTONE"
  entity: { type: String, required: true }, // e.g. "AidTransaction", "MilestoneVerification"
  entityId: { type: mongoose.Schema.Types.ObjectId, required: false },
  description: { type: String },
  role: { type: String }, // role of user who did the action
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("AuditLog", auditLogSchema);
