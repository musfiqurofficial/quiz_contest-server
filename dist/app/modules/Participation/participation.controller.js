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
exports.getParticipationsByQuiz = exports.deleteParticipation = exports.submitParticipationAnswer = exports.updateParticipation = exports.checkParticipation = exports.getParticipationById = exports.getParticipations = exports.createParticipation = void 0;
const participation_model_1 = require("./participation.model");
const questionUpload_1 = require("../../config/questionUpload");
const event_model_1 = require("../events/event.model");
const createParticipation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create participation
        const participation = yield participation_model_1.Participation.create(req.body);
        // Update event participants list
        yield event_model_1.Event.findByIdAndUpdate(participation.quizId, {
            $addToSet: { participants: participation.studentId },
        }, { new: true });
        res.status(201).json({ success: true, data: participation });
    }
    catch (error) {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        // Handle duplicate participation error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'You have already participated in this quiz',
            });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});
exports.createParticipation = createParticipation;
const getParticipations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get user ID from authenticated request
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }
        // Filter participations by the authenticated user
        const participations = yield participation_model_1.Participation.find({ studentId: userId })
            .populate('studentId', 'fullNameEnglish fullNameBangla contact')
            .populate('quizId');
        res.json({ success: true, data: participations });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getParticipations = getParticipations;
const getParticipationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const participation = yield participation_model_1.Participation.findById(req.params.id)
            .populate('studentId', 'fullNameEnglish fullNameBangla contact')
            .populate('quizId');
        if (!participation)
            return res
                .status(404)
                .json({ success: false, message: 'Participation not found' });
        res.json({ success: true, data: participation });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getParticipationById = getParticipationById;
const checkParticipation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { studentId, quizId } = req.body;
        const participation = yield participation_model_1.Participation.findOne({ studentId, quizId });
        if (participation) {
            return res.json({
                success: true,
                hasParticipated: true,
                status: participation.status,
            });
        }
        res.json({ success: true, hasParticipated: false });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.checkParticipation = checkParticipation;
const updateParticipation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const participation = yield participation_model_1.Participation.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate('studentId', 'fullNameEnglish fullNameBangla contact')
            .populate('quizId');
        if (!participation) {
            return res.status(404).json({
                success: false,
                message: 'Participation not found',
            });
        }
        res.json({ success: true, data: participation });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.updateParticipation = updateParticipation;
// Submit participation answer with optional images for a specific question
const submitParticipationAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // participation id
        const { questionId, selectedOption, participantAnswer, isCorrect, marksObtained, } = req.body;
        const participation = yield participation_model_1.Participation.findById(id);
        if (!participation) {
            return res
                .status(404)
                .json({ success: false, message: 'Participation not found' });
        }
        let participantImages = [];
        if (req.files) {
            const files = Array.isArray(req.files)
                ? req.files
                : Object.values(req.files).flat();
            // @ts-ignore
            participantImages = files.map((file) => (0, questionUpload_1.getFileInfo)(file));
        }
        const answers = participation.answers || [];
        const idx = answers.findIndex((a) => { var _a; return ((_a = a.questionId) === null || _a === void 0 ? void 0 : _a.toString()) === questionId; });
        const updated = {
            questionId,
            selectedOption: selectedOption || '',
            participantAnswer: participantAnswer || '',
            isCorrect: !!isCorrect,
            marksObtained: Number(marksObtained) || 0,
            participantImages,
        };
        if (idx >= 0) {
            answers[idx] = Object.assign(Object.assign({}, answers[idx]), updated);
        }
        else {
            answers.push(updated);
        }
        participation.answers = answers;
        participation.totalScore = answers.reduce((sum, a) => sum + (a.marksObtained || 0), 0);
        yield participation.save();
        res.json({ success: true, data: participation });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.submitParticipationAnswer = submitParticipationAnswer;
const deleteParticipation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const participation = yield participation_model_1.Participation.findByIdAndDelete(id);
        if (!participation) {
            return res.status(404).json({
                success: false,
                message: 'Participation not found',
            });
        }
        res.json({ success: true, message: 'Participation deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.deleteParticipation = deleteParticipation;
const getParticipationsByQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId } = req.params;
        const participations = yield participation_model_1.Participation.find({ quizId })
            .populate('studentId', 'fullNameEnglish fullNameBangla contact')
            .populate('quizId')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: participations });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.getParticipationsByQuiz = getParticipationsByQuiz;
