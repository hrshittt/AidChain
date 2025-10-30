const mongoose = require("mongoose");
const NGOSchema = new mongoose.Schema({
  orgName: String,
  description: String,
  website: String,
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["donor", "ngo", "beneficiary"], required: true },
  ethAddress: { type: String, required: true, unique: true },
  ngoInfo: {
    type: NGOSchema,
    required: function() { return this.role === "ngo"; },
    default: void 0
  }
}, { timestamps: { createdAt: true, updatedAt: false }});

module.exports = mongoose.model("User", UserSchema);
