import MilestoneVerification from "../models/MilestoneVerification.js";
import { logAction } from "./audit/auditController.js";

export const verifyMilestone = async (req, res) => {
  try {
    const { transactionId, verifiedBy, milestone, verificationStatus, remarks } = req.body;
    if (!transactionId || !verifiedBy || !milestone)
      return res.status(400).json({ msg: "transactionId, verifiedBy, milestone required" });
    const verification = await MilestoneVerification.create({ transactionId, verifiedBy, milestone, verificationStatus, remarks });
    await logAction({
      user: verifiedBy,
      role: req.user?.role,
      action: "VERIFY_MILESTONE",
      entity: "MilestoneVerification",
      entityId: verification._id,
      description: `Milestone: ${milestone}, Status: ${verificationStatus}`
    });
    res.status(201).json({ msg: "Milestone verified", verification });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
