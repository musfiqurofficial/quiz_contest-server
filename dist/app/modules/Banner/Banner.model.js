"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const mongoose_1 = require("mongoose");
const BannerSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    buttonText: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'delete'],
        default: 'approved',
    },
}, {
    timestamps: true,
});
exports.Banner = (0, mongoose_1.model)('Banner', BannerSchema);
