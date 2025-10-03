"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerValidations = exports.updateBannerValidationSchema = exports.createBannerValidationSchema = void 0;
const zod_1 = require("zod");
// Matches your IBanner model
exports.createBannerValidationSchema = zod_1.z.object({
    body: zod_1.z.array(zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        image: zod_1.z.string().url(),
        buttonText: zod_1.z.string(),
        status: zod_1.z.enum(['approved', 'pending', 'delete']).optional(),
    })),
});
exports.updateBannerValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        description: zod_1.z.string().optional(),
        image: zod_1.z.string().url().optional(),
        buttonText: zod_1.z.string().optional(),
        status: zod_1.z.enum(['approved', 'pending', 'delete']).optional(),
    }),
});
exports.BannerValidations = {
    createBannerValidationSchema: exports.createBannerValidationSchema,
    updateBannerValidationSchema: exports.updateBannerValidationSchema,
};
