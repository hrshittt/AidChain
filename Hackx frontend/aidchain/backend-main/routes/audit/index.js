import express from "express";
import { getAuditLogs } from "../../controllers/audit/auditController.js";
import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
const router = express.Router();

router.get("/list", auth, role("admin"), getAuditLogs);

export default router;
