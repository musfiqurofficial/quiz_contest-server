const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin } = require("../middleware/auth");

// Get all quizzes
router.get("/", authenticate, async (req, res) => {
  try {
    const Quiz = require("../models/Quiz");
    const quizzes = await Quiz.find({ status: "published" })
      .populate("createdBy", "fullNameEnglish")
      .sort({ startTime: 1 });

    res.json({
      success: true,
      data: { quizzes },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quizzes",
    });
  }
});

// Get single quiz
router.get("/:id", authenticate, async (req, res) => {
  try {
    const Quiz = require("../models/Quiz");
    const quiz = await Quiz.findById(req.params.id).populate(
      "createdBy",
      "fullNameEnglish"
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.json({
      success: true,
      data: { quiz },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz",
    });
  }
});

// Create quiz (Admin only)
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const Quiz = require("../models/Quiz");
    const quiz = new Quiz({
      ...req.body,
      createdBy: req.user._id,
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: { quiz },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create quiz",
    });
  }
});

module.exports = router;
