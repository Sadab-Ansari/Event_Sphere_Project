const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController"); // Ensure correct import

const router = express.Router();

router.get("/profile", authMiddleware, userController.getUserProfile);
router.put("/profile", authMiddleware, userController.updateUserProfile);
router.get("/profile/events", authMiddleware, userController.getUserEvents);

module.exports = router;
