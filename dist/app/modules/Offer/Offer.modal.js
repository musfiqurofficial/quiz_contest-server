"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Offer = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OfferSchema = new mongoose_1.default.Schema({
    img: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    dailyGift: {
        type: Number,
        required: true,
    },
    dayLength: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['approved', 'delete', 'pending'],
        default: 'pending',
    },
});
exports.Offer = mongoose_1.default.model('Offer', OfferSchema);
