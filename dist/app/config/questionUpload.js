"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowedFileTypes = exports.deleteQuestionFile = exports.getFileInfo = exports.questionMixedUpload = exports.questionFileUpload = exports.questionImageUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Create uploads directories if they don't exist
const uploadsDir = path_1.default.join(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const questionFilesDir = path_1.default.join(uploadsDir, 'question-files');
if (!fs_1.default.existsSync(questionFilesDir)) {
    fs_1.default.mkdirSync(questionFilesDir, { recursive: true });
}
const questionImagesDir = path_1.default.join(uploadsDir, 'question-images');
if (!fs_1.default.existsSync(questionImagesDir)) {
    fs_1.default.mkdirSync(questionImagesDir, { recursive: true });
}
// Storage configuration for question files
const questionFileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Determine destination based on file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, questionImagesDir);
        }
        else {
            cb(null, questionFilesDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path_1.default.extname(file.originalname);
        const prefix = file.mimetype.startsWith('image/') ? 'img-' : 'file-';
        cb(null, prefix + uniqueSuffix + extension);
    },
});
// File filter for question uploads
const questionFileFilter = (req, file, cb) => {
    // Allow images
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    // Allow common document types
    else if (file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'text/plain' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb(null, true);
    }
    // Allow compressed files
    else if (file.mimetype === 'application/zip' ||
        file.mimetype === 'application/x-rar-compressed' ||
        file.mimetype === 'application/x-7z-compressed') {
        cb(null, true);
    }
    else {
        cb(new Error('Unsupported file type. Allowed types: Images, PDF, Word, Excel, Text, ZIP, RAR, 7Z'));
    }
};
// Multer instances for different upload types
exports.questionImageUpload = (0, multer_1.default)({
    storage: questionFileStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed for image uploads'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for images
        files: 5, // Maximum 5 files per upload
    },
});
exports.questionFileUpload = (0, multer_1.default)({
    storage: questionFileStorage,
    fileFilter: questionFileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit for files
        files: 3, // Maximum 3 files per upload
    },
});
exports.questionMixedUpload = (0, multer_1.default)({
    storage: questionFileStorage,
    fileFilter: questionFileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
        files: 5, // Maximum 5 files per upload
    },
});
// Helper function to get file info for database storage
const getFileInfo = (file) => {
    // Build a web-accessible path under /uploads instead of absolute filesystem path
    const isImage = file.mimetype.startsWith('image/');
    const urlPath = isImage
        ? `/uploads/question-images/${file.filename}`
        : `/uploads/question-files/${file.filename}`;
    return {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: urlPath,
        uploadedAt: new Date(),
    };
};
exports.getFileInfo = getFileInfo;
// Helper function to delete uploaded files
const deleteQuestionFile = (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            return true;
        }
        return false;
    }
    catch (error) {
        // Error deleting file - could be logged to a proper logging service
        return false;
    }
};
exports.deleteQuestionFile = deleteQuestionFile;
// Helper function to get allowed file types for written questions
const getAllowedFileTypes = () => {
    return {
        images: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
        ],
        documents: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ],
        spreadsheets: [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        archives: [
            'application/zip',
            'application/x-rar-compressed',
            'application/x-7z-compressed',
        ],
    };
};
exports.getAllowedFileTypes = getAllowedFileTypes;
