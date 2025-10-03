"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkDeleteQuestions = exports.bulkCreateQuestions = exports.updateQuestionWithImages = exports.getQuestionsByType = exports.submitAnswer = exports.uploadQuestionImages = exports.deleteQuestion = exports.updateQuestion = exports.getQuestionsByQuizId = exports.getQuestionById = exports.getQuestions = exports.createQuestion = void 0;
const questions_model_1 = require("./questions.model");
const questionUpload_1 = require("../../config/questionUpload");
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield questions_model_1.Question.create(req.body);
        res.status(201).json({ success: true, data: question });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createQuestion = createQuestion;
const getQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { populate } = req.query;
        let query = questions_model_1.Question.find();
        if (populate === 'quizId') {
            query = query.populate('quizId');
        }
        const questions = yield query;
        res.json({ success: true, data: questions });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getQuestions = getQuestions;
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { populate } = req.query;
        let query = questions_model_1.Question.findById(id);
        if (populate === 'quizId') {
            query = query.populate('quizId');
        }
        const question = yield query;
        if (!question) {
            return res
                .status(404)
                .json({ success: false, message: 'Question not found' });
        }
        res.json({ success: true, data: question });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getQuestionById = getQuestionById;
const getQuestionsByQuizId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        const { populate } = req.query;
        let query = questions_model_1.Question.find({ quizId });
        if (populate === 'quizId') {
            query = query.populate('quizId');
        }
        const questions = yield query;
        res.json({ success: true, data: questions });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getQuestionsByQuizId = getQuestionsByQuizId;
// Update single question
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const question = yield questions_model_1.Question.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate('quizId');
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found',
            });
        }
        res.json({
            success: true,
            message: 'Question updated successfully',
            data: question,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update question',
        });
    }
});
exports.updateQuestion = updateQuestion;
// Delete single question
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const question = yield questions_model_1.Question.findByIdAndDelete(id);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found',
            });
        }
        res.json({
            success: true,
            message: 'Question deleted successfully',
            data: { deletedId: id },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete question',
        });
    }
});
exports.deleteQuestion = deleteQuestion;
// Upload images for questions (Short and Written types)
const uploadQuestionImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded',
            });
        }
        const files = Array.isArray(req.files)
            ? req.files
            : Object.values(req.files).flat();
        const uploadedFiles = files.map((file) => (0, questionUpload_1.getFileInfo)(file));
        res.json({
            success: true,
            message: 'Images uploaded successfully',
            data: uploadedFiles,
        });
    }
    catch (error) {
        // Clean up uploaded files if there's an error
        if (req.files) {
            const files = Array.isArray(req.files)
                ? req.files
                : Object.values(req.files).flat();
            files.forEach((file) => {
                (0, questionUpload_1.deleteQuestionFile)(file.path);
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.uploadQuestionImages = uploadQuestionImages;
// Submit answer for a question (with optional image upload)
const submitAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId } = req.params;
        const { answer, participantId } = req.body;
        const question = yield questions_model_1.Question.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found',
            });
        }
        // Handle image uploads for Short and Written questions
        let participantImages = [];
        if (req.files &&
            (question.questionType === 'Short' || question.questionType === 'Written')) {
            const files = Array.isArray(req.files)
                ? req.files
                : Object.values(req.files).flat();
            participantImages = files.map((file) => (0, questionUpload_1.getFileInfo)(file));
        }
        // Update question with participant's answer
        const updatedQuestion = yield questions_model_1.Question.findByIdAndUpdate(questionId, {
            participantAnswer: answer,
            participantImages: participantImages,
            isAnswered: true,
            answeredAt: new Date(),
        }, { new: true });
        res.json({
            success: true,
            message: 'Answer submitted successfully',
            data: updatedQuestion,
        });
    }
    catch (error) {
        // Clean up uploaded files if there's an error
        if (req.files) {
            const files = Array.isArray(req.files)
                ? req.files
                : Object.values(req.files).flat();
            files.forEach((file) => {
                (0, questionUpload_1.deleteQuestionFile)(file.path);
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.submitAnswer = submitAnswer;
// Get questions by type
const getQuestionsByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.params;
        const { quizId, populate } = req.query;
        let query = { questionType: type };
        if (quizId) {
            query.quizId = quizId;
        }
        let questionsQuery = questions_model_1.Question.find(query);
        if (populate === 'quizId') {
            questionsQuery = questionsQuery.populate('quizId');
        }
        const questions = yield questionsQuery;
        res.json({ success: true, data: questions });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getQuestionsByType = getQuestionsByType;
// Update question with uploaded images
const updateQuestionWithImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionId } = req.params;
        const { uploadedImages } = req.body;
        const question = yield questions_model_1.Question.findById(questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found',
            });
        }
        // Validate that question type supports image uploads
        if (question.questionType === 'MCQ') {
            return res.status(400).json({
                success: false,
                message: 'MCQ questions do not support image uploads',
            });
        }
        const updatedQuestion = yield questions_model_1.Question.findByIdAndUpdate(questionId, { uploadedImages }, { new: true });
        res.json({
            success: true,
            message: 'Question updated with images successfully',
            data: updatedQuestion,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateQuestionWithImages = updateQuestionWithImages;
// Bulk create questions
const bulkCreateQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questions } = req.body;
        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Questions array is required and must not be empty',
            });
        }
        // Validate each question
        const validatedQuestions = questions.map((question, index) => {
            if (!question.quizId) {
                throw new Error(`Question ${index + 1}: quizId is required`);
            }
            if (!question.text) {
                throw new Error(`Question ${index + 1}: text is required`);
            }
            if (!question.questionType ||
                !['MCQ', 'Short', 'Written'].includes(question.questionType)) {
                throw new Error(`Question ${index + 1}: questionType must be MCQ, Short, or Written`);
            }
            if (!question.marks || question.marks < 1) {
                throw new Error(`Question ${index + 1}: marks must be at least 1`);
            }
            if (!question.difficulty ||
                !['easy', 'medium', 'hard'].includes(question.difficulty)) {
                throw new Error(`Question ${index + 1}: difficulty must be easy, medium, or hard`);
            }
            // Validate MCQ specific fields
            if (question.questionType === 'MCQ') {
                if (!question.options ||
                    !Array.isArray(question.options) ||
                    question.options.length < 2) {
                    throw new Error(`Question ${index + 1}: MCQ questions must have at least 2 options`);
                }
                if (!question.correctAnswer) {
                    throw new Error(`Question ${index + 1}: MCQ questions must have a correct answer`);
                }
                if (!question.options.includes(question.correctAnswer)) {
                    throw new Error(`Question ${index + 1}: correct answer must be one of the options`);
                }
            }
            // Validate Written specific fields (Short questions have optional correctAnswer)
            if (question.questionType === 'Written' && !question.correctAnswer) {
                throw new Error(`Question ${index + 1}: Written questions must have a correct answer`);
            }
            // Validate Written specific fields
            if (question.questionType === 'Written') {
                if (question.wordLimit && question.wordLimit < 10) {
                    throw new Error(`Question ${index + 1}: word limit must be at least 10`);
                }
                if (question.timeLimit && question.timeLimit < 1) {
                    throw new Error(`Question ${index + 1}: time limit must be at least 1 minute`);
                }
            }
            return {
                quizId: question.quizId,
                questionType: question.questionType,
                text: question.text,
                options: question.options || [],
                correctAnswer: question.correctAnswer || '',
                marks: question.marks,
                difficulty: question.difficulty,
                wordLimit: question.wordLimit,
                timeLimit: question.timeLimit,
                explanation: question.explanation || '',
            };
        });
        // Create all questions
        const createdQuestions = yield questions_model_1.Question.insertMany(validatedQuestions);
        res.status(201).json({
            success: true,
            message: `${createdQuestions.length} questions created successfully`,
            data: createdQuestions,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Failed to create questions',
        });
    }
});
exports.bulkCreateQuestions = bulkCreateQuestions;
// Bulk delete questions
const bulkDeleteQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { questionIds } = req.body;
        if (!questionIds ||
            !Array.isArray(questionIds) ||
            questionIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Question IDs array is required and must not be empty',
            });
        }
        // Validate that all IDs are valid MongoDB ObjectIds
        const validIds = questionIds.filter((id) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id));
        if (validIds.length !== questionIds.length) {
            return res.status(400).json({
                success: false,
                message: 'Some question IDs are invalid',
            });
        }
        // Delete questions
        const result = yield questions_model_1.Question.deleteMany({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete questions',
        });
    }
});
exports.bulkDeleteQuestions = bulkDeleteQuestions;
