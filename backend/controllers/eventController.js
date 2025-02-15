const Event = require("../models/eventModel");

// ✅ Create Event (User Organizes an Event)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      organizer: req.user.id, // Get user from token
    });

    await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email"); // Populate organizer details
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Register for an Event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    event.registeredUsers.push(req.user.id);
    await event.save();
    res.status(200).json({ message: "Registered successfully", event });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete an Event (Only Organizer/Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.organizer.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized" });

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
