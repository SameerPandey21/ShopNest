const express = require("express");
const { createOrder, verifyPayment } = require("../controllers/paymentController.js");
const router = express.Router();


router.post("/verify", verifyPayment); 
router.post("/order", createOrder);

 module.exports = router;
