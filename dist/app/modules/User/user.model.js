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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student',
    },
    isSuperAdmin: {
        type: Boolean,
        default: false,
    },
    // Basic info
    fullNameBangla: { type: String, required: true },
    fullNameEnglish: { type: String, required: true },
    fatherName: { type: String },
    motherName: { type: String },
    dateOfBirth: { type: Date },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    // Address
    union: { type: String },
    postOffice: { type: String },
    upazila: { type: String },
    district: { type: String },
    address: { type: String, required: true },
    // Education
    grade: { type: String, required: true },
    institutionName: { type: String },
    institutionAddress: { type: String },
    rollId: { type: String },
    // Contact
    contact: { type: String, required: true, unique: true },
    contactType: { type: String, enum: ['phone', 'email'], required: true },
    parentContact: { type: String },
    whatsappNumber: { type: String },
    // Health
    bloodGroup: { type: String },
    specialNeeds: { type: String },
    // Digital ability
    hasSmartphone: { type: Boolean, default: false },
    internetUsage: {
        type: String,
        enum: ['always', 'sometimes', 'never'],
        default: 'never',
    },
    // Interests & goals
    interests: [{ type: String }],
    preferredSubjects: [{ type: String }],
    futureGoals: { type: String },
    // Profile image (নতুন যোগ করা)
    profileImage: { type: String },
    // Auth
    password: { type: String, required: true },
    tokens: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', UserSchema);
