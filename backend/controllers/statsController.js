const Event = require("../models/eventModel");

const getEventStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments({
      date: { $gte: new Date() }, // Ensure the event date is not in the past
    });

    const allEvents = await Event.find({
      date: { $gte: new Date() }, // Filter events that are upcoming or in progress
    })
      .populate("participants.user", "_id")
      .populate("organizer", "_id");

    const uniqueParticipantIds = new Set();
    const uniqueOrganizerIds = new Set();

    allEvents.forEach((event) => {
      if (event.participants) {
        event.participants.forEach((p) => {
          if (p.user) {
            uniqueParticipantIds.add(p.user.toString());
          }
        });
      }

      if (event.organizer) {
        uniqueOrganizerIds.add(event.organizer._id.toString());
      }
    });

    res.status(200).json({
      events: totalEvents,
      participants: uniqueParticipantIds.size,
      organizers: uniqueOrganizerIds.size,
    });
  } catch (error) {
    console.error("Error fetching event stats:", error);
    res.status(500).json({ error: "Failed to fetch event statistics" });
  }
};

module.exports = { getEventStats };
