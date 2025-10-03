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
exports.deleteQuiz = exports.updateQuiz = exports.getQuizzesByEventId = exports.getQuizById = exports.getQuizzes = exports.createQuiz = void 0;
const quiz_modal_1 = require("./quiz.modal");
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quiz = yield quiz_modal_1.Quiz.create(req.body);
        res.status(201).json({ success: true, data: quiz });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createQuiz = createQuiz;
const getQuizzes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { populate } = req.query;
        let query = quiz_modal_1.Quiz.find();
        if (populate === 'eventId') {
            query = query.populate('eventId');
        }
        const quizzes = yield query;
        res.json({ success: true, data: quizzes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getQuizzes = getQuizzes;
const getQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { populate } = req.query;
        let query = quiz_modal_1.Quiz.findById(id);
        if (populate === 'eventId') {
            query = query.populate('eventId');
        }
        const quiz = yield query;
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        res.json({ success: true, data: quiz });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getQuizById = getQuizById;
const getQuizzesByEventId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { eventId } = req.params;
        const { populate } = req.query;
        let query = quiz_modal_1.Quiz.find({ eventId });
        if (populate === 'eventId') {
            query = query.populate('eventId');
        }
        const quizzes = yield query;
        res.json({ success: true, data: quizzes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getQuizzesByEventId = getQuizzesByEventId;
// Add updateQuiz function
const updateQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quiz = yield quiz_modal_1.Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('questions').populate('eventId');
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        res.json({ success: true, data: quiz });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateQuiz = updateQuiz;
// Add deleteQuiz function
const deleteQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quiz = yield quiz_modal_1.Quiz.findByIdAndDelete(req.params.id);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }
        res.json({ success: true, data: {} });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteQuiz = deleteQuiz;
