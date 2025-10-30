import express from "express";
import { getStatus } from "../../controllers/dashboardController.js";
import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
const router = express.Router();

router.get("/status", auth, role("admin"), getStatus);

export default router;
