"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// uploads ডিরেক্টরি তৈরি করুন যদি না থাকে
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const profilePicsDir = path_1.default.join(uploadsDir, 'profile-pics');
if (!fs_1.default.existsSync(profilePicsDir)) {
    fs_1.default.mkdirSync(profilePicsDir, { recursive: true });
}
// স্টোরেজ কনফিগারেশন
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profilePicsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path_1.default.extname(file.originalname);
        cb(null, 'profile-' + uniqueSuffix + extension);
    }
});
// ফাইল ফিল্টার
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('শুধুমাত্র ইমেজ ফাইল অনুমোদিত'));
    }
};
// Multer instance
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});
exports.default = upload;
