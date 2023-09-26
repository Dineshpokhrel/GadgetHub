const express = require("express");
const userOrderController = require("../../../controllers/user/userOrderController");
const router = express.Router();

router.get("/orders", userOrderController.getMyOrder);

router.post("/order/place", userOrderController.placeOrder);

module.exports = router;
