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
  },

  organizerEmail: {
    type: String,
    required: true,
  }, // New field for email communication

  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      interests: { type: [String], default: [] },
    },
  ],

  interests: { type: [String], default: undefined },

  category: {
    type: String,
    enum: ["Tech", "Sports", "Music", "Business", "Other"],
    default: "Other",
  },

  capacity: { type: Number, default: 100 },

  time: { type: String, required: true },

  status: {
    type: String,
    enum: ["Upcoming", "Completed", "Cancelled"],
    default: "Upcoming",
  },

  // Ticket Price
  price: {
    type: Number,
    required: true,
    default: 0, // Free event by default
  },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
