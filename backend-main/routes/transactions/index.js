import express from "express";
import { donate, getTransactions, getTransactionsPublic } from "../../controllers/transactionController.js";
import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
const router = express.Router();

router.post("/donate", auth, role("donor"), donate);
// Public demo endpoint (no auth) useful for local dev/demo flows
router.post("/donate/public", donate);
// Authenticated route (admin/user) for listing transactions
router.get("/transactions", auth, getTransactions);
// Public route to allow frontend to display tracking without requiring auth
router.get("/transactions/public", getTransactionsPublic);

export default router;
