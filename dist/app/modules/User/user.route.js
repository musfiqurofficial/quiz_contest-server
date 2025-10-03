"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
// D:\PersonalClientWork\quiz-contest\quiz-contest-bcknd\src\app\modules\User\user.route.ts
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const multer_1 = __importDefault(require("../../config/multer"));
const router = (0, express_1.Router)();
// Public routes
router.post('/register', multer_1.default.single('profileImage'), user_controller_1.registerUser); // ইমেজ আপলোড মিডলওয়্যার যোগ
router.post('/login', user_controller_1.loginUser);
router.post('/check-user', user_controller_1.checkUserExists);
// Protected routes
router.post('/logout', auth_middleware_1.authenticate, user_controller_1.logoutUser);
router.get('/profile', auth_middleware_1.authenticate, user_controller_1.getUserProfile);
router.put('/profile', multer_1.default.single('profileImage'), auth_middleware_1.authenticate, user_controller_1.updateUserProfile); // ইমেজ আপলোড মিডলওয়্যার যোগ
// Admin only routes
router.get('/admin/users', auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(['admin']), user_controller_1.getAllUsersForAdmin);
router.get('/admin/users/:userId', auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(['admin']), user_controller_1.getUserDetailsWithParticipations);
exports.UserRoutes = router;
