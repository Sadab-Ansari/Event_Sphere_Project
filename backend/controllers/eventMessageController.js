const EventMessage = require("../models/eventMessageModel");
const User = require("../models/userModel");
const Event = require("../models/eventModel");

// ✅ Controller to create an event message & emit it in real-time
const createEventMessage = async (req, res) => {
  try {
    let { userId, eventId } = req.body;
    const io = req.app.get("io"); // ✅ Get the socket instance from Express

    if (!userId || !eventId) {
      return res
        .status(400)
        .json({ success: false, error: "User ID and Event ID are required." });
    }

    // ✅ Convert to ObjectId if it's not already (to match database format)
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(eventId)
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid User ID or Event ID format." });
    }

    userId = new mongoose.Types.ObjectId(userId);
    eventId = new mongoose.Types.ObjectId(eventId);

    // ✅ Check if user & event exist
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res
        .status(404)
        .json({ success: false, error: "User or Event not found." });
    }

    const message = `${user.name} created the event "${event.title}"`;

    const newMessage = new EventMessage({
      userId,
      eventId,
      message,
    });

    await newMessage.save();

    console.log("✅ Event message created:", newMessage);

    // ✅ Emit the real-time message to all connected clients
    io.emit("newEventMessage", {
      _id: newMessage._id,
      message: newMessage.message,
      timestamp: newMessage.timestamp,
      user: { name: user.name },
      event: { title: event.title },
    });

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

    // ✅ Corrected field names and optimized query
    const messages = await EventMessage.find({ userId: userId }) // No need for ObjectId
      .populate("userId", "name")
      .populate("eventId", "title")
      .sort({ timestamp: -1 })
      .lean();

    if (!messages.length) {
      return res.status(404).json({
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
