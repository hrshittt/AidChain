const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { role, name, ethAddress, ngoInfo } = req.body;
    if (!role || !name || !ethAddress) return res.status(400).json({ success: false, msg: "role, name, ethAddress required." });
    const user = new User({ role, name, ethAddress, ngoInfo });
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({success: false, msg: "User not found"});
    res.json({ success: true, msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};
