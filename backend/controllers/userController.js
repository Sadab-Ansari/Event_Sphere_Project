const fs = require("fs");
const path = require("path");
const User = require("../models/userModel");
const Event = require("../models/eventModel");

// ✅ Get User Profile with Organized & Participated Events
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Fetch Organized Events
    const organizedEvents = await Event.find({ organizer: req.user.id });

    // ✅ Fetch Participated Events
    const participatedEvents = await Event.find({
      registeredUsers: req.user.id,
    });

    res.status(200).json({
      user,
      organizedEvents,
      participatedEvents,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update User Profile (Including Profile Picture)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Update fields if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    // ✅ Save profile picture path only if a new file is uploaded
    if (req.file) {
      user.profilePic = `/uploads/profile/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get User Events (For Participated Events)
const getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ registeredUsers: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Remove Profile Picture
const removeProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.profilePic) {
      return res.status(400).json({ message: "No profile picture to remove" });
    }

    // Correct profile image path
    const filePath = path.join(
      __dirname,
      "../uploads/profile",
      path.basename(user.profilePic)
    );

    // Delete the image file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    user.profilePic = ""; // Remove from database
    await user.save();

    res.json({ message: "Profile picture removed successfully", user });
  } catch (error) {
    console.error("Error removing profile picture:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Ensure Correct Export
module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserEvents,
  removeProfilePicture,
};
