const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { authenticate, requireAdmin } = require("../middleware/auth");

// Routes
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);
router.put("/change-password", authenticate, authController.changePassword);

// Admin routes
router.get("/all", authenticate, requireAdmin, async (req, res) => {
  try {
    const User = require("../models/User");
    const users = await User.find({})
      .select("-password -tokens")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

module.exports = router;
