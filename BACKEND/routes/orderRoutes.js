const express = require("express");
const { protect } = require("../middleware/authmiddleware.js");
const { admin } = require("../middleware/adminmiddleware.js");
const router = express.Router();
const { createOrder, getOrders, myOrders, updateOrderStatus } = require("../controllers/orderController.js");

 router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
 router.route('/myorders').get(protect, myOrders);
 router.route('/:id/status').put(protect, admin, updateOrderStatus);
 module.exports = router;








