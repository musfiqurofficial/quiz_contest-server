const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    location: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "completed", "cancelled"],
      default: "upcoming",
    },
    maxParticipants: {
      type: Number,
      default: null,
    },
    currentParticipants: {
      type: Number,
      default: 0,
    },
    registrationFee: {
      type: Number,
      default: 0,
    },
    organizer: {
      type: String,
      trim: true,
    },
    contactInfo: {
      email: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ status: 1 });

// Check if event is active
eventSchema.methods.isActive = function () {
  const now = new Date();
  return (
    this.status === "active" && now >= this.startDate && now <= this.endDate
  );
};

module.exports = mongoose.model("Event", eventSchema);
