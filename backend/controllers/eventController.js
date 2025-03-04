const fs = require("fs");
const path = require("path");
const Event = require("../models/eventModel");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const moment = require("moment");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      time,
      capacity,
      interests,
      category,
    } = req.body;

    // Validate required fields
    if (!title || !date || !location || !time) {
      return res
        .status(400)
        .json({ error: "Title, date, location, and time are required!" });
    }

    // Format the time to 12-hour format
    const formattedTime = moment(time, "HH:mm").format("hh:mm A");

    const banner = req.file ? `/uploads/${req.file.filename}` : null;

    let parsedInterests = [];
    if (typeof interests === "string") {
      try {
        const jsonParsed = JSON.parse(interests);
        if (Array.isArray(jsonParsed)) {
          parsedInterests = jsonParsed.filter((i) => i.trim() !== "");
        } else {
          parsedInterests = interests
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean);
        }
      } catch (error) {
        parsedInterests = interests
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
      }
    } else if (Array.isArray(interests)) {
      parsedInterests = interests.filter((i) => i.trim() !== "");
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      time: formattedTime, // Save the formatted time with AM/PM
      capacity: capacity || 100,
      organizer: req.user.id,
      banner,
      ...(parsedInterests.length > 0 ? { interests: parsedInterests } : {}),
      category: category || "Other",
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

const registerForEvent = async (req, res) => {
  try {
    const { interests } = req.body;
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
    const userInterests =
      typeof interests === "string"
        ? interests.split(",").map((i) => i.trim())
        : interests || [];
    event.participants.push({ user: req.user.id, interests: userInterests });
    await event.save();
    res.status(200).json({ message: "Registered successfully", event });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name email");
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)
      .populate("organizer", "name email")
      .populate({ path: "participants.user", select: "name email phone" });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const withdrawFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });
    const participantIndex = event.participants.findIndex(
      (p) => p.user.toString() === req.user.id
    );
    if (participantIndex === -1) {
      return res
        .status(400)
        .json({ error: "You are not registered for this event." });
    }
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

const updateEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      time,
      maxParticipants,
      interests,
    } = req.body;
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    if (event.organizer.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this event" });
    }
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

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Remove event reference from participants' registered events
    await User.updateMany(
      { registeredEvents: event._id },
      { $pull: { registeredEvents: event._id } }
    );

    // Delete event banner if exists
    if (event.banner) {
      const bannerPath = path.join(__dirname, "..", event.banner);
      if (fs.existsSync(bannerPath)) {
        fs.unlinkSync(bannerPath);
      }
    }

    // Delete the event itself
    await Event.findByIdAndDelete(req.params.eventId);

    res
      .status(200)
      .json({ message: "Event deleted along with participants' records" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const currentDate = new Date();
    const upcomingEvents = await Event.find({ date: { $gte: currentDate } })
      .populate("organizer", "name email")
      .sort({ date: 1 }); // Sort by date in ascending order

    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createEvent,
  registerForEvent,
  getEvents,
  getEventById,
  withdrawFromEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
};
