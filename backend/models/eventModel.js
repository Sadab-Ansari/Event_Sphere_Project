const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  banner: { type: String }, // Stores the path to the banner image

  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Tracks who created the event

  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      interests: { type: [String], default: [] }, // ✅ Store multiple interests per user
    },
  ], // Users who joined with multiple interests

  interests: { type: [String], default: [] }, // ✅ Available interests for the event

  category: {
    type: String,
    enum: ["Tech", "Sports", "Music", "Business", "Other"],
    default: "Other",
  }, // Optional filtering

  capacity: { type: Number, default: 100 }, // Max participants

  time: { type: String }, // Added time field
  status: {
    type: String,
    enum: ["Upcoming", "Completed", "Cancelled"],
    default: "Upcoming",
  }, // Event status
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
