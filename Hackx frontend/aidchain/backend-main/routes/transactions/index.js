import express from "express";
import { donate, getTransactions } from "../../controllers/transactionController.js";
import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
const router = express.Router();

router.post("/donate", auth, role("donor"), donate);
router.get("/transactions", auth, getTransactions);

export default router;
