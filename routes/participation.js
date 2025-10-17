const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth");

// Start quiz participation
router.post("/start/:quizId", authenticate, async (req, res) => {
  try {
    const Participation = require("../models/Participation");
    const Quiz = require("../models/Quiz");

    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check if quiz is active
    if (!quiz.isActive()) {
      return res.status(400).json({
        success: false,
        message: "Quiz is not currently active",
      });
    }

    // Check if user already participated
    const existingParticipation = await Participation.findOne({
      user: req.user._id,
      quiz: req.params.quizId,
    });

    if (existingParticipation) {
      return res.status(400).json({
        success: false,
        message: "You have already participated in this quiz",
      });
    }

    // Create participation
    const participation = new Participation({
      user: req.user._id,
      quiz: req.params.quizId,
      totalQuestions: quiz.totalQuestions,
      timeRemaining: quiz.duration * 60, // Convert minutes to seconds
    });

    await participation.save();

    res.status(201).json({
      success: true,
      message: "Quiz participation started",
      data: { participation },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to start quiz participation",
    });
  }
});

// Submit quiz answers
router.post("/submit/:quizId", authenticate, async (req, res) => {
  try {
    const Participation = require("../models/Participation");
    const { answers } = req.body;

    const participation = await Participation.findOne({
      user: req.user._id,
      quiz: req.params.quizId,
      status: "in-progress",
    });

    if (!participation) {
      return res.status(404).json({
        success: false,
        message: "Participation not found or already submitted",
      });
    }

    // Update participation
    participation.answers = answers;
    participation.submittedAt = new Date();
    participation.endTime = new Date();
    participation.status = "completed";

    // Calculate results
    let correctAnswers = 0;
    let wrongAnswers = 0;
    let obtainedMarks = 0;

    for (const answer of answers) {
      if (answer.answer) {
        participation.attemptedQuestions++;

        // Check if answer is correct (simplified)
        if (answer.isCorrect) {
          correctAnswers++;
          obtainedMarks += answer.marksObtained || 1;
        } else {
          wrongAnswers++;
        }
      }
    }

    participation.correctAnswers = correctAnswers;
    participation.wrongAnswers = wrongAnswers;
    participation.obtainedMarks = obtainedMarks;

    await participation.save();

    res.json({
      success: true,
      message: "Quiz submitted successfully",
      data: {
        participation: participation.getSummary(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit quiz",
    });
  }
});

// Get user's participations
router.get("/my-participations", authenticate, async (req, res) => {
  try {
    const Participation = require("../models/Participation");

    const participations = await Participation.find({ user: req.user._id })
      .populate("quiz", "title startTime endTime")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { participations },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch participations",
    });
  }
});

module.exports = router;
