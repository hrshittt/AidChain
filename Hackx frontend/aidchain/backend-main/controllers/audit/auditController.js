import AuditLog from "../../models/audit/AuditLog.js";

export const logAction = async ({ user, role, action, entity, entityId, description }) => {
  return AuditLog.create({ user, action, entity, entityId, description, role });
};

export const getAuditLogs = async (req, res) => {
  try {
    const { user, entity } = req.query;
    const filter = {};
    if (user) filter.user = user;
    if (entity) filter.entity = entity;
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).populate('user');
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
