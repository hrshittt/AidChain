const role = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Unauthorized: no user" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ msg: "Forbidden: insufficient role" });
  next();
};
export default role;
