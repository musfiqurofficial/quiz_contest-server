"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferValidation = exports.updateOfferValidationSchema = void 0;
const zod_1 = require("zod");
const createOfferValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        img: zod_1.z.string().url({ message: 'Image URL must be valid' }),
        amount: zod_1.z
            .number({ required_error: 'Amount is required' })
            .nonnegative('Amount must be a positive number'),
        dailyGift: zod_1.z
            .number({ required_error: 'Daily gift is required' })
            .nonnegative('Daily gift must be a positive number'),
        dayLength: zod_1.z
            .number({ required_error: 'Day length is required' })
            .positive('Day length must be more than zero'),
        status: zod_1.z.enum(['pending', 'delete', 'approved']).optional(),
    }),
});
exports.updateOfferValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        img: zod_1.z.string().optional(),
        amount: zod_1.z.number().optional(),
        dailyGift: zod_1.z.number().optional(),
        dayLength: zod_1.z.number().optional(),
        status: zod_1.z.enum(['approved', 'delete', 'pending']).optional(),
    }),
});
exports.OfferValidation = {
    createOfferValidationSchema,
    updateOfferValidationSchema: exports.updateOfferValidationSchema,
};
