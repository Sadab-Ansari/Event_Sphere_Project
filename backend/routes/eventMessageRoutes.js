const express = require("express");
const {
  createEventMessage,
  getUserEventMessages,
} = require("../controllers/eventMessageController");

const router = express.Router();

// ✅ Route to create an event message
router.post("/messages", createEventMessage);

// ✅ Route to get event messages for a specific user
router.get("/user/:userId", getUserEventMessages);

module.exports = router;
