const router = require("express").Router();
const deliveryController = require("../controllers/deliveryController");
router.post("/verify", deliveryController.verifyDelivery);
router.post("/verifyDelivery", deliveryController.verifyDelivery);
module.exports = router;
