const express = require("express");
const { protect } = require("../middleware/authmiddleware.js");
const { admin } = require("../middleware/adminmiddleware.js");
const{ getAdminStats } = require("../controllers/analyticsController.js");
const router = express.Router();
router.get("/", protect, admin, getAdminStats);
module.exports = router;