"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgeModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const JudgeMemberSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, { _id: false });
const QuizDataSchema = new mongoose_1.default.Schema({
    panel: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    members: {
        type: [JudgeMemberSchema],
        required: true,
    },
}, {
    timestamps: true,
});
exports.JudgeModel = mongoose_1.default.model('Judge', QuizDataSchema);
