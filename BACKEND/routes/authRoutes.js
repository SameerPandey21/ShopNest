const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUser } = require("../controllers/authController.js");
const { protect } = require("../middleware/authmiddleware.js");
const { admin } = require("../middleware/adminmiddleware.js");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, admin, getUser);
router.get("/users", protect, admin, getUser);
module.exports = router;