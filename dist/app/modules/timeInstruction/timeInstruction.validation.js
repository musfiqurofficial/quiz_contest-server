"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeInstructionValidation = exports.updateTimeInstructionValidationSchema = exports.createTimeInstructionValidationSchema = void 0;
const zod_1 = require("zod");
const quizInfoSectionSchema = zod_1.z.object({
    title: zod_1.z.string(),
    points: zod_1.z.array(zod_1.z.string()),
    bgColor: zod_1.z.string().optional(),
    textColor: zod_1.z.string().optional(),
});
exports.createTimeInstructionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        timeline: quizInfoSectionSchema,
        instructions: quizInfoSectionSchema,
    }),
});
exports.updateTimeInstructionValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        timeline: quizInfoSectionSchema.partial(),
        instructions: quizInfoSectionSchema.partial(),
    }),
});
exports.TimeInstructionValidation = {
    createTimeInstructionValidationSchema: exports.createTimeInstructionValidationSchema,
    updateTimeInstructionValidationSchema: exports.updateTimeInstructionValidationSchema,
};
