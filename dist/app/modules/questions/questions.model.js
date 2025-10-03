"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const QuestionFileSchema = new mongoose_1.Schema({
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
}, { _id: false });
const QuestionSchema = new mongoose_1.Schema({
    quizId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    questionType: {
        type: String,
        enum: ['MCQ', 'Short', 'Written'],
        required: true,
    },
    text: { type: String, required: true },
    options: [{ type: String }], // Only required for MCQ
    correctAnswer: { type: String }, // For MCQ and Short questions
    marks: { type: Number, default: 1, min: 1 },
    explanation: { type: String },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
    // Image upload support for Short and Written questions
    uploadedImages: [QuestionFileSchema],
    // Additional fields for Written questions
    wordLimit: { type: Number, min: 50 },
    timeLimit: { type: Number, min: 1 }, // in minutes
    // Participation response fields
    participantAnswer: { type: String },
    participantImages: [QuestionFileSchema],
    isAnswered: { type: Boolean, default: false },
    answeredAt: { type: Date },
}, { timestamps: true });
exports.Question = mongoose_1.default.model('Question', QuestionSchema);
