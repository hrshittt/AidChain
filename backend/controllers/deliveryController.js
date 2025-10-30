const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const Transaction = require("../models/Transaction");

const contractABI = JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../contracts/AidDistributionABI.json')));
const contractAddress = require(path.resolve(__dirname,'../../contracts/deployedAddress.json')).address;
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

exports.verifyDelivery = async (req, res) => {
  try {
    const { aidId, beneficiary } = req.body;
    if (typeof aidId === "undefined" || !beneficiary) return res.status(400).json({ success: false, msg: "aidId and beneficiary required." });
    const tx = await contract.confirmDelivery(aidId, beneficiary);
    await tx.wait();
    // Optionally update local DB for auditing
    await Transaction.updateOne({ aidId }, { delivered: true, beneficiary });
    res.json({ success: true, hash: tx.hash });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};
