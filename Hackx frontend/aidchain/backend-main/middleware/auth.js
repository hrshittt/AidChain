import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token)
    return res.status(401).json({ msg: "No token. Unauthorized." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
export default auth;
