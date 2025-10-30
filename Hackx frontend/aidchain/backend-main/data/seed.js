import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import AidTransaction from "../models/AidTransaction.js";
import MilestoneVerification from "../models/MilestoneVerification.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const seedData = async () => {
  await User.deleteMany();
  await AidTransaction.deleteMany();
  await MilestoneVerification.deleteMany();

  const donor = await User.create({
    name: "Amit Sharma",
    email: "amit.donor@gmail.com",
    role: "donor",
    verified: true
  });

  const ngo = await User.create({
    name: "Helping Hands NGO",
    email: "contact@helpinghands.org",
    role: "ngo",
    verified: true
  });

  const recipient = await User.create({
    name: "Rina Patel",
    email: "rina.patel@example.com",
    role: "recipient"
  });

  const transaction = await AidTransaction.create({
    donorId: donor._id,
    ngoId: ngo._id,
    recipientId: recipient._id,
    type: "donation",
    aidCategory: "food",
    amount: 100,
    status: "completed"
  });

  await MilestoneVerification.create({
    transactionId: transaction._id,
    verifiedBy: ngo._id,
    milestone: "Delivered to recipient",
    verificationStatus: "verified"
  });

  console.log("✅ Data seeded successfully");
  process.exit();
};

seedData();
