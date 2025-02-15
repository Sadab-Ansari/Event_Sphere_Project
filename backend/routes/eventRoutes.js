const express = require("express");
const {
  createEvent,
  getEvents,
  registerForEvent,
  deleteEvent,
} = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware"); // Ensure user is logged in
const router = express.Router();

// ✅ Create Event (User can organize events)
router.post("/create", authMiddleware, createEvent);

// ✅ Get All Events (Anyone can access)
router.get("/all", getEvents);

// ✅ Register for an Event (Only logged-in users)
router.post("/register/:eventId", authMiddleware, registerForEvent);

// ✅ Delete an Event (Only the creator or admin can delete)
router.delete("/delete/:eventId", authMiddleware, deleteEvent);

module.exports = router;
