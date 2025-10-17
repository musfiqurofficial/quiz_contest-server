const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// Create Question
const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question,
    });
  } catch (error) {
    console.error("Create question error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create question",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all Questions
const getQuestions = async (req, res) => {
  try {
    const { quiz, type, difficulty, status, populate } = req.query;
    let query = Question.find();

    // Filter by quiz if provided
    if (quiz) {
      query = query.where({ quiz });
    }

    // Filter by type if provided
    if (type) {
      query = query.where({ type });
    }

    // Filter by difficulty if provided
    if (difficulty) {
      query = query.where({ difficulty });
    }

    // Filter by status if provided
    if (status) {
      query = query.where({ status });
    }

    // Populate quiz if requested
    if (populate === "quiz") {
      query = query.populate("quiz", "title description");
    }

    const questions = await query.sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      message: "Questions fetched successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Get questions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get single Question
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;

    let query = Question.findById(id);

    if (populate === "quiz") {
      query = query.populate("quiz", "title description");
    }

    const question = await query;

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.json({
      success: true,
      message: "Question fetched successfully",
      data: question,
    });
  } catch (error) {
    console.error("Get question error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch question",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update Question
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const question = await Question.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.json({
      success: true,
      message: "Question updated successfully",
      data: question,
    });
  } catch (error) {
    console.error("Update question error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to update question",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete Question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete question error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete question",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get questions by quiz
const getQuestionsByQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { populate } = req.query;

    let query = Question.find({ quiz: quizId });

    if (populate === "quiz") {
      query = query.populate("quiz", "title description");
    }

    const questions = await query.sort({ order: 1 });

    res.json({
      success: true,
      message: "Quiz questions fetched successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Get questions by quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quiz questions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get questions by type
const getQuestionsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { quiz, populate } = req.query;

    let query = Question.find({ type });

    if (quiz) {
      query = query.where({ quiz });
    }

    if (populate === "quiz") {
      query = query.populate("quiz", "title description");
    }

    const questions = await query.sort({ order: 1 });

    res.json({
      success: true,
      message: "Questions by type fetched successfully",
      data: questions,
    });
  } catch (error) {
    console.error("Get questions by type error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch questions by type",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Bulk create questions
const bulkCreateQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Questions array is required and must not be empty",
      });
    }

    // Validate each question
    const validatedQuestions = questions.map((question, index) => {
      if (!question.quiz) {
        throw new Error(`Question ${index + 1}: quiz ID is required`);
      }
      if (!question.questionText) {
        throw new Error(`Question ${index + 1}: question text is required`);
      }
      if (
        !question.type ||
        ![
          "multiple-choice",
          "true-false",
          "fill-in-the-blank",
          "essay",
        ].includes(question.type)
      ) {
        throw new Error(
          `Question ${
            index + 1
          }: type must be multiple-choice, true-false, fill-in-the-blank, or essay`
        );
      }
      if (!question.marks || question.marks < 0.5) {
        throw new Error(`Question ${index + 1}: marks must be at least 0.5`);
      }
      if (
        !question.difficulty ||
        !["easy", "medium", "hard"].includes(question.difficulty)
      ) {
        throw new Error(
          `Question ${index + 1}: difficulty must be easy, medium, or hard`
        );
      }

      // Validate MCQ specific fields
      if (question.type === "multiple-choice") {
        if (
          !question.options ||
          !Array.isArray(question.options) ||
          question.options.length < 2
        ) {
          throw new Error(
            `Question ${index + 1}: MCQ questions must have at least 2 options`
          );
        }
        const hasCorrectOption = question.options.some(
          (option) => option.isCorrect
        );
        if (!hasCorrectOption) {
          throw new Error(
            `Question ${
              index + 1
            }: MCQ questions must have at least one correct option`
          );
        }
      }

      return {
        quiz: question.quiz,
        questionText: question.questionText,
        questionImage: question.questionImage,
        type: question.type,
        options: question.options || [],
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        difficulty: question.difficulty,
        marks: question.marks,
        negativeMarks: question.negativeMarks || 0,
        subject: question.subject,
        category: question.category,
        tags: question.tags || [],
        status: question.status || "draft",
        createdBy: question.createdBy,
        order: question.order || 0,
      };
    });

    // Create all questions
    const createdQuestions = await Question.insertMany(validatedQuestions);

    res.status(201).json({
      success: true,
      message: `${createdQuestions.length} questions created successfully`,
      data: createdQuestions,
    });
  } catch (error) {
    console.error("Bulk create questions error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to create questions",
    });
  }
};

// Bulk delete questions
const bulkDeleteQuestions = async (req, res) => {
  try {
    const { questionIds } = req.body;

    if (
      !questionIds ||
      !Array.isArray(questionIds) ||
      questionIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Question IDs array is required and must not be empty",
      });
    }

    // Validate that all IDs are valid MongoDB ObjectIds
    const validIds = questionIds.filter(
      (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)
    );

    if (validIds.length !== questionIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some question IDs are invalid",
      });
    }

    // Delete questions
    const result = await Question.deleteMany({
      _id: { $in: validIds },
    });

    res.json({
      success: true,
      message: `${result.deletedCount} questions deleted successfully`,
      data: {
        deletedCount: result.deletedCount,
        deletedIds: validIds,
      },
    });
  } catch (error) {
    console.error("Bulk delete questions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete questions",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Submit answer for a question
const submitAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answer, userId } = req.body;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if answer is correct
    const isCorrect = question.checkAnswer(answer);
    const marksObtained = isCorrect
      ? question.marks
      : question.negativeMarks || 0;

    // Update question statistics
    question.totalAttempts += 1;
    if (isCorrect) {
      question.correctAttempts += 1;
    }
    await question.save();

    res.json({
      success: true,
      message: "Answer submitted successfully",
      data: {
        isCorrect,
        marksObtained,
        correctAnswer: question.getCorrectAnswer(),
        explanation: question.explanation,
      },
    });
  } catch (error) {
    console.error("Submit answer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit answer",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsByQuiz,
  getQuestionsByType,
  bulkCreateQuestions,
  bulkDeleteQuestions,
  submitAnswer,
};
