const express = require("express");
const router = express.Router();

const { authenticate, requireAdmin } = require("../middleware/auth");

// Get questions for a quiz
router.get("/quiz/:quizId", authenticate, async (req, res) => {
  try {
    const Question = require("../models/Question");
    const questions = await Question.find({
      quiz: req.params.quizId,
      status: "published",
    }).sort({ order: 1 });

    res.json({
      success: true,
      data: { questions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
    });
  }
});

// Create question (Admin only)
router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const Question = require("../models/Question");
    const question = new Question({
      ...req.body,
      createdBy: req.user._id,
    });

    await question.save();

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: { question },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create question",
    });
  }
});

module.exports = router;
