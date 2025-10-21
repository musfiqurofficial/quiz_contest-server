const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, "../uploads/profile-pics"),
  path.join(__dirname, "../uploads/question-images"),
  path.join(__dirname, "../uploads/question-files"),
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === "profileImage") {
      uploadPath = path.join(__dirname, "../uploads/profile-pics");
    } else if (file.fieldname === "questionImage") {
      uploadPath = path.join(__dirname, "../uploads/question-images");
    } else if (file.fieldname === "questionFile") {
      uploadPath = path.join(__dirname, "../uploads/question-files");
    } else {
      uploadPath = path.join(__dirname, "../uploads");
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images for profile and question images
  if (file.fieldname === "profileImage" || file.fieldname === "questionImage") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed for profile and question images"
        ),
        false
      );
    }
  } else if (file.fieldname === "questionFile") {
    // Allow various file types for question files
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF, Word, Excel, and text files are allowed for question files"
        ),
        false
      );
    }
  } else {
    cb(new Error("Invalid field name"), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Error handling middleware
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 5MB.",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files uploaded.",
      });
    }
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message: "Unexpected field name.",
      });
    }
  }
  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next(error);
};

module.exports = upload;
