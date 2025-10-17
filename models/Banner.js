const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Banner description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Banner image is required"],
      trim: true,
    },
    buttonText: {
      type: String,
      required: [true, "Button text is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["approved", "pending", "delete"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bannerSchema.index({ status: 1 });

module.exports = mongoose.model("Banner", bannerSchema);
