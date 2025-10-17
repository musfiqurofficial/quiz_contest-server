/**
 * Multer configuration for file uploads
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const uploadDirs = [
  "uploads/profile-pics",
  "uploads/question-images",
  "uploads/question-files",
  "uploads/banners",
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/";

    if (file.fieldname === "profileImage") {
      uploadPath += "profile-pics/";
    } else if (file.fieldname === "questionImage") {
      uploadPath += "question-images/";
    } else if (file.fieldname === "questionFile") {
      uploadPath += "question-files/";
    } else if (file.fieldname === "bannerImage") {
      uploadPath += "banners/";
    } else {
      uploadPath += "general/";
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  }
  // Allow documents
  else if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  }
  // Reject other files
  else {
    cb(new Error("Only images and documents are allowed"), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Specific upload configurations
const profileUpload = multer({
  storage: multer.diskStorage({
    destination: "uploads/profile-pics/",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `profile-${uniqueSuffix}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed for profile pictures"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for profile pictures
  },
});

const questionImageUpload = multer({
  storage: multer.diskStorage({
    destination: "uploads/question-images/",
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `img-${uniqueSuffix}-${file.originalname}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed for question images"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for question images
  },
});

module.exports = {
  upload,
  profileUpload,
  questionImageUpload,
};
