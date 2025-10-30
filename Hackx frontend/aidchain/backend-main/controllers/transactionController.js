import AidTransaction from "../models/AidTransaction.js";
import User from "../models/User.js";
import { logAction } from "./audit/auditController.js";
import { getContract } from "../utils/blockchain.js";

export const donate = async (req, res) => {
  try {
    const { donorId, ngoId, recipientId, type, aidCategory, amount } = req.body;
    if (!donorId || !ngoId || !recipientId || !type || !aidCategory)
      return res.status(400).json({ msg: "Missing required fields" });
    const tx = await AidTransaction.create({ donorId, ngoId, recipientId, type, aidCategory, amount, status: "initiated" });
    await logAction({
      user: donorId,
      role: req.user?.role,
      action: "CREATE_DONATION",
      entity: "AidTransaction",
      entityId: tx._id,
      description: `Donation/Transaction created: type=${type} aidCategory=${aidCategory} amount=${amount}`
    });
    res.status(201).json({ msg: "Donation/Transaction added", tx });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // DB records for dashboards
    const txs = await AidTransaction.find().populate('donorId ngoId recipientId');
    // Blockchain contract merge test (works even if contract is null now!)
    let onChain = null;
    let onChainStatus = "not attempted";
    const contract = getContract();
    if (contract) {
      try {
        onChain = await contract.getAllAids();
        onChainStatus = "ok";
      } catch (err) {
        onChain = null;
        onChainStatus = "error/contract unreachable";
      }
    } else {
      onChainStatus = "error/contract not loaded";
    }
    res.json({
      dbRecords: txs,
      onChainData: onChain,
      onChainStatus,
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
