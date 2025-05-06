const express = require("express");
const router = express.Router();
const { getEventStats } = require("../controllers/statsController");
// const { authenticateUser } = require("../middleware/authMiddleware"); // or whatever auth you're using

// Make sure the controller function is passed correctly to the route
router.get("/stats", getEventStats);

module.exports = router;
