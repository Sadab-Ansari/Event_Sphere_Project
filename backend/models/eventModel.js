const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Tracks who created the event
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who joined
  category: {
    type: String,
    enum: ["Tech", "Sports", "Music", "Business", "Other"],
    default: "Other",
  }, // Optional filtering
  capacity: { type: Number, default: 100 }, // Max participants
  status: {
    type: String,
    enum: ["Upcoming", "Completed", "Cancelled"],
    default: "Upcoming",
  }, // Event status
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
