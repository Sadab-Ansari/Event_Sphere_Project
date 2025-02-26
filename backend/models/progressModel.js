const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  completed: { type: Number, required: true, default: 0 },
  total: { type: Number, required: true, default: 0 },
  percentage: { type: Number, required: true, default: 0 }, // Auto-calculated
});

module.exports = mongoose.model("Progress", progressSchema);
