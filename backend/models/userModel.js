const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google OAuth
  googleId: { type: String, unique: true }, // Store Google ID
  phone: { type: String, default: "" },
  profilePic: { type: String, default: "/uploads/profile/default.jpg" }, // ✅ Default Profile Pic
});

module.exports = mongoose.model("User", UserSchema);
