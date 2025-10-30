import express from "express";
import { verifyMilestone } from "../../controllers/milestoneController.js";
import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
const router = express.Router();

router.post("/verify", auth, role("ngo", "admin"), verifyMilestone);

export default router;
