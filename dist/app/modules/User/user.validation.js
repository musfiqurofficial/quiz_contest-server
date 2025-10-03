"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = exports.updateUserValidationSchema = exports.createUserValidationSchema = void 0;
const zod_1 = require("zod");
exports.createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string(),
        img: zod_1.z.string(),
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
        role: zod_1.z.enum(['admin', 'general', 'vip', 'moderator']).optional(),
    }),
});
exports.updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        password: zod_1.z.string().optional(),
        img: zod_1.z.string().optional(),
        role: zod_1.z.enum(['admin', 'moderator', 'vip', 'general']).optional(),
    }),
});
exports.UserValidations = {
    createUserValidationSchema: exports.createUserValidationSchema,
    updateUserValidationSchema: exports.updateUserValidationSchema,
};
