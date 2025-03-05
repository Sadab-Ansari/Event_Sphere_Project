const EventMessage = require("../models/eventMessageModel");
const User = require("../models/userModel");
const Event = require("../models/eventModel");

// ✅ Controller to create an event message
const createEventMessage = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res
        .status(400)
        .json({ success: false, error: "User ID and Event ID are required." });
    }

    // Fetch user and event details
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res
        .status(404)
        .json({ success: false, error: "User or Event not found." });
    }

    // Create message dynamically
    const message = `${user.name} created the event "${event.title}"`;

    // Save event message
    const newMessage = new EventMessage({
      user: userId,
      event: eventId,
      message,
    });

    await newMessage.save();

    console.log("✅ Event message created:", newMessage);
    res.status(201).json({
      success: true,
      message: "Event message created successfully.",
      eventMessage: newMessage,
    });
  } catch (error) {
    console.error("❌ Error creating event message:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// ✅ Controller to get event messages for a user
const getUserEventMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, error: "User ID is required." });
    }

    // Fetch messages and populate user & event details
    const messages = await EventMessage.find({ user: userId })
      .populate("user", "name") // Get username only
      .populate("event", "title") // Get event title only
      .sort({ timestamp: -1 }) // Latest messages first
      .lean(); // Optimize performance

    if (!messages.length) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No event messages found for this user.",
        });
    }

    console.log(
      `✅ Retrieved ${messages.length} event messages for user ${userId}`
    );
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("❌ Error fetching event messages:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

module.exports = { createEventMessage, getUserEventMessages };
