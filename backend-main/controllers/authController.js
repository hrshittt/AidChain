import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, organizationName } = req.body;
    if (!name || !email || !role)
      return res.status(400).json({ msg: "name, email, and role required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ msg: "Email already exists" });
    const hashed = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      phone,
      address,
      organizationName
    });
    res.status(201).json({ msg: "User registered", user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "email and password required" });
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(401).json({ msg: "User not found or no password set" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    res.json({ token, user: { _id: user._id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
