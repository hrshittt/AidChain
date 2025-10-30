import AidTransaction from "../models/AidTransaction.js";

export const getStatus = async (req, res) => {
  try {
    const total = await AidTransaction.countDocuments();
    const completed = await AidTransaction.countDocuments({ status: "completed" });
    const inProgress = await AidTransaction.countDocuments({ status: { $in: ["initiated", "in-progress"] } });
    const recent = await AidTransaction.find().sort({ createdAt: -1 }).limit(5);
    res.json({ total, completed, inProgress, recent });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
