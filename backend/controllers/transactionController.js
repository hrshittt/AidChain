const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const Transaction = require("../models/Transaction");

// Read contract ABI + address
const contractABI = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../contracts/AidDistributionABI.json')));
const contractAddress = require(path.resolve(__dirname,'../../contracts/deployedAddress.json')).address;

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const contract = new ethers.Contract(contractAddress, contractABI, provider);

exports.getTransactions = async (req, res) => {
  try {
    // Read all on-chain Aids
    const aids = await contract.getAllAids();
    // Optionally merge with MongoDB metadata
    // const txs = await Transaction.find();
    res.json({ success: true, data: aids });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const tx = await Transaction.findOne({ aidId: req.params.aidId });
    if (!tx) return res.status(404).json({ success: false, msg: "Transaction not found." });
    res.json({ success: true, tx });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { aidId, donor, donorName, donorAddress, ngo, ngoName, beneficiary, amount, purpose, delivered, onChainTimestamp, txHash } = req.body;
    if (typeof aidId === "undefined") return res.status(400).json({ success: false, msg: "aidId required." });
    const tx = new Transaction({ aidId, donor, donorName, donorAddress, ngo, ngoName, beneficiary, amount, purpose, delivered, onChainTimestamp, txHash });
    await tx.save();
    res.json({ success: true, tx });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findOneAndUpdate({ aidId: req.params.aidId }, req.body, { new: true });
    if (!tx) return res.status(404).json({ success: false, msg: 'Transaction not found.' });
    res.json({ success: true, tx });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};
