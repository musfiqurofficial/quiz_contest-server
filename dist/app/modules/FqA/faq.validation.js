"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaQValidation = exports.updateFaQValidationSchema = exports.createFaQValidationSchema = void 0;
const zod_1 = require("zod");
const singleFaqSchema = zod_1.z.object({
    question: zod_1.z.string(),
    answer: zod_1.z.string(),
});
exports.createFaQValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        faq: zod_1.z.array(singleFaqSchema),
        status: zod_1.z.enum(['pending', 'delete', 'approved']).optional(),
    }),
});
exports.updateFaQValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        faq: zod_1.z.array(singleFaqSchema).optional(),
        status: zod_1.z.enum(['approved', 'delete', 'pending']).optional(),
    }),
});
exports.FaQValidation = {
    createFaQValidationSchema: exports.createFaQValidationSchema,
    updateFaQValidationSchema: exports.updateFaQValidationSchema,
};
