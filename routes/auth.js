const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const handleValidationErrors = require("../middleware/validation");

// Validation rules
const registerValidation = [
  body("fullNameBangla")
    .optional()
    .notEmpty()
    .withMessage("Full name in Bangla is required"),
  body("fullNameEnglish")
    .optional()
    .notEmpty()
    .withMessage("Full name in English is required"),
  body("age")
    .optional()
    .isInt({ min: 5, max: 100 })
    .withMessage("Age must be between 5 and 100"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("address").optional().notEmpty().withMessage("Address is required"),
  body("grade").optional().notEmpty().withMessage("Grade/Class is required"),
  body("contact").notEmpty().withMessage("Contact is required"),
  body("contactType")
    .optional()
    .isIn(["phone", "email"])
    .withMessage("Contact type must be phone or email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidation = [
  body("contact").notEmpty().withMessage("Contact is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
];

// Routes
router.post(
  "/register",
  registerValidation,
  handleValidationErrors,
  authController.register
);
router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  authController.login
);
router.post("/logout", authenticate, authController.logout);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);
router.put(
  "/change-password",
  changePasswordValidation,
  handleValidationErrors,
  authenticate,
  authController.changePassword
);

module.exports = router;
