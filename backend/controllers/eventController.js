const fs = require("fs");
const path = require("path");
const Event = require("../models/eventModel");

// ✅ Create Event (User Organizes an Event)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants, interests } =
      req.body;

    // Validate Required Fields
    if (!title || !date || !location) {
      return res
        .status(400)
        .json({ error: "Title, date, and location are required!" });
    }

    // ✅ Store the uploaded image path
    const banner = req.file ? `/uploads/${req.file.filename}` : null;

    // ✅ Ensure interests are stored as an array
    const parsedInterests =
      typeof interests === "string"
        ? interests.split(",").map((i) => i.trim())
        : interests || [];

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      maxParticipants: maxParticipants || 100,
      organizer: req.user.id,
      banner,
      interests: parsedInterests, // ✅ Store available interests
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

// ✅ Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get Single Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate("organizer", "name email")
      .populate("participants.user", "name email"); // ✅ Populate user details

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Register for an Event with Interest Selection
exports.registerForEvent = async (req, res) => {
  try {
    const { interest } = req.body; // Get selected interest
    const event = await Event.findById(req.params.eventId);

    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if user is already registered
    const isAlreadyRegistered = event.participants.some(
      (p) => p.user.toString() === req.user.id
    );
    if (isAlreadyRegistered) {
      return res
        .status(400)
        .json({ error: "You are already registered for this event." });
    }

    // If event has interests, ensure user selects a valid one
    if (
      event.interests.length > 0 &&
      (!interest || !event.interests.includes(interest))
    ) {
      return res.status(400).json({ error: "Invalid interest selected." });
    }

    // ✅ Add user with selected interest
    event.participants.push({ user: req.user.id, interest: interest || null });
    await event.save();

    res.status(200).json({ message: "Registered successfully", event });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update an Event (Only Organizer)
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants, interests } =
      req.body;

    // Validate required fields
    if (!title || !date || !location) {
      return res
        .status(400)
        .json({ error: "Title, date, and location are required" });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this event" });
    }

    // ✅ Delete old banner if a new one is uploaded
    if (req.file) {
      if (event.banner) {
        const oldBannerPath = path.join(__dirname, "..", event.banner);
        if (fs.existsSync(oldBannerPath)) {
          fs.unlinkSync(oldBannerPath); // Delete the old file
        }
      }
      event.banner = `/uploads/${req.file.filename}`;
    }

    // ✅ Ensure interests are updated correctly
    event.title = title;
    event.description = description;
    event.date = date;
    event.location = location;
    event.maxParticipants = maxParticipants || event.maxParticipants;
    event.interests =
      typeof interests === "string"
        ? interests.split(",").map((i) => i.trim())
        : interests || [];

    const updatedEvent = await event.save();
    res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete an Event (Only Organizer/Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // ✅ Delete event banner
    if (event.banner) {
      const bannerPath = path.join(__dirname, "..", event.banner);
      if (fs.existsSync(bannerPath)) {
        fs.unlinkSync(bannerPath);
      }
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
