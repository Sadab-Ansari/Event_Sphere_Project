const fs = require("fs");
const path = require("path");
const Event = require("../models/eventModel");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

// ✅ Create Event (User Organizes an Event)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants, interests } =
      req.body;

    if (!title || !date || !location) {
      return res
        .status(400)
        .json({ error: "Title, date, and location are required!" });
    }

    const banner = req.file ? `/uploads/${req.file.filename}` : null;

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
      interests: parsedInterests,
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

// ✅ Register for an Event
exports.registerForEvent = async (req, res) => {
  try {
    const { interest } = req.body;
    const event = await Event.findById(req.params.eventId);
    const user = await User.findById(req.user.id);

    if (!event) return res.status(404).json({ error: "Event not found" });

    const isAlreadyRegistered = event.participants.some(
      (p) => p.user.toString() === req.user.id
    );
    if (isAlreadyRegistered) {
      return res
        .status(400)
        .json({ error: "You are already registered for this event." });
    }

    if (
      event.interests.length > 0 &&
      (!interest || !event.interests.includes(interest))
    ) {
      return res.status(400).json({ error: "Invalid interest selected." });
    }

    event.participants.push({ user: req.user.id, interest: interest || null });
    await event.save();

    // ✅ Send Confirmation Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Event Participation Confirmation",
      text: `Hello ${
        user.name
      },\n\nYou have successfully registered for the event: ${
        event.title
      }.\n\nEvent Details:\n- Date: ${new Date(
        event.date
      ).toDateString()}\n- Location: ${
        event.location
      }\n\nThank you for participating!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Registered successfully", event });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Withdraw from an Event
exports.withdrawFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Find index of the user in participants array
    const participantIndex = event.participants.findIndex(
      (p) => p.user.toString() === req.user.id
    );

    if (participantIndex === -1) {
      return res
        .status(400)
        .json({ error: "You are not registered for this event." });
    }

    // Remove user from participants list
    event.participants.splice(participantIndex, 1);
    await event.save();

    res
      .status(200)
      .json({ message: "Successfully withdrawn from event", event });
  } catch (error) {
    console.error("Error withdrawing from event:", error);
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
      .populate("participants.user", "name email");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update an Event (Only Organizer)
exports.updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, maxParticipants, interests } =
      req.body;

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

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
          fs.unlinkSync(oldBannerPath);
        }
      }
      event.banner = `/uploads/${req.file.filename}`;
    }

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

    // ✅ Delete event banner if it exists
    if (event.banner) {
      const bannerPath = path.join(__dirname, "..", event.banner);
      if (fs.existsSync(bannerPath)) {
        fs.unlinkSync(bannerPath);
      }
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Server error" });
  }
};
