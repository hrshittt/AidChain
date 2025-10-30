const router = require("express").Router();
const transactionController = require("../controllers/transactionController");

router.get("/", transactionController.getTransactions);
router.get("/:aidId", transactionController.getTransactionById);
router.post("/", transactionController.createTransaction);
router.put("/:aidId", transactionController.updateTransaction);

module.exports = router;
