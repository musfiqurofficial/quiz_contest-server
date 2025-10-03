"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JudgeValidation = exports.updateJudgeValidationSchema = exports.createJudgeValidationSchema = void 0;
const zod_1 = require("zod");
exports.createJudgeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        panel: zod_1.z.string(),
        description: zod_1.z.string(),
        members: zod_1.z.array(zod_1.z.object({
            name: zod_1.z.string(),
            designation: zod_1.z.string(),
            image: zod_1.z.string().url(),
        })),
    }),
});
exports.updateJudgeValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        panel: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        members: zod_1.z
            .array(zod_1.z.object({
            name: zod_1.z.string().optional(),
            designation: zod_1.z.string().optional(),
            image: zod_1.z.string().url().optional(),
        }))
            .optional(),
    }),
});
exports.JudgeValidation = {
    createJudgeValidationSchema: exports.createJudgeValidationSchema,
    updateJudgeValidationSchema: exports.updateJudgeValidationSchema,
};
