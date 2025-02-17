const Event = require("../models/eventModel");

// Create Event (User Organizes an Event)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants } = req.body;

    // Validate Required Fields
    if (!title || !date || !location) {
      return res
        .status(400)
        .json({ error: "Title, date, and location are required!" });
    }

    // Correctly store the image URL
    const banner = req.file ? `/uploads/${req.file.filename}` : null;

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      maxParticipants: maxParticipants || 100,
      organizer: req.user.id,
      banner, // Store correct image path
    });

    await newEvent.save();
    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email"); // Populate organizer details
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Register for an Event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if user is already registered
    if (event.participants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ error: "You are already registered for this event." });
    }

    event.participants.push(req.user.id);

    await event.save();
    res.status(200).json({ message: "Registered successfully", event });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Single Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate("organizer", "name email")
      .populate("participants", "name email");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete an Event (Only Organizer/Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
