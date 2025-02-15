const User = require("../models/userModel");
const Event = require("../models/eventModel");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.profilePic = req.body.profilePic || user.profilePic;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ participants: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//  Fix: Ensure correct export format
module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserEvents,
};
