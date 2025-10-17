const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin } = require("../middleware/auth");

// Get all events
router.get("/", async (req, res) => {
  try {
    const Event = require("../models/Event");
    const events = await Event.find({ status: "active" }).sort({
      startDate: 1,
    });

    res.json({
      success: true,
      data: { events },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
});

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const Event = require("../models/Event");
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      data: { event },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch event",
    });
  }
});

module.exports = router;
