"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getUserDetailsWithParticipations = exports.getAllUsersForAdmin = exports.getUserProfile = exports.logoutUser = exports.checkUserExists = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("./user.model");
const config_1 = __importDefault(require("../../config"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Generate JWT Token
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, config_1.default.jwt_secret, { expiresIn: '7d' });
};
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullNameBangla, fullNameEnglish, fatherName, motherName, dateOfBirth, age, gender, union, postOffice, upazila, district, address, grade, institutionName, institutionAddress, rollId, contact, contactType, parentContact, whatsappNumber, bloodGroup, specialNeeds, hasSmartphone, internetUsage, interests, preferredSubjects, futureGoals, password, } = req.body;
        // Check if user already exists
        const existingUser = yield user_model_1.User.findOne({ contact });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'এই পরিচিতি নম্বর/ইমেইল দিয়ে ইতিমধ্যেই একজন ব্যবহারকারী নিবন্ধিত',
            });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        let profileImagePath;
        if (req.file) {
            profileImagePath = `/uploads/profile-pics/${req.file.filename}`;
        }
        // Create new user
        const newUser = new user_model_1.User({
            fullNameBangla,
            fullNameEnglish,
            fatherName,
            motherName,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
            age: parseInt(age),
            gender,
            union,
            postOffice,
            upazila,
            district,
            address,
            grade,
            institutionName,
            institutionAddress,
            rollId,
            contact,
            contactType,
            parentContact,
            whatsappNumber,
            bloodGroup,
            specialNeeds,
            hasSmartphone: hasSmartphone === 'true',
            internetUsage,
            interests: Array.isArray(interests)
                ? interests
                : interests
                    ? [interests]
                    : [],
            preferredSubjects: Array.isArray(preferredSubjects)
                ? preferredSubjects
                : preferredSubjects
                    ? [preferredSubjects]
                    : [],
            futureGoals,
            password: hashedPassword,
            profileImage: profileImagePath,
            role: 'student',
        });
        yield newUser.save();
        // Generate token
        const token = generateToken(newUser._id.toString());
        // Store token in user document
        newUser.tokens.push(token);
        yield newUser.save();
        res.status(201).json({
            success: true,
            message: 'ব্যবহারকারী সফলভাবে নিবন্ধিত হয়েছে',
            data: {
                user: {
                    id: newUser._id,
                    fullNameBangla: newUser.fullNameBangla,
                    fullNameEnglish: newUser.fullNameEnglish,
                    contact: newUser.contact,
                    contactType: newUser.contactType,
                    role: newUser.role,
                    profileImage: newUser.profileImage,
                },
                token,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'সার্ভার ত্রুটি' });
    }
});
exports.registerUser = registerUser;
// Login User
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contact, password } = req.body;
        // Find user by contact
        const user = yield user_model_1.User.findOne({ contact, isActive: true });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }
        // Check password
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid credentials' });
        }
        // Generate token
        const token = generateToken(user._id.toString());
        // Store token in user document
        user.tokens.push(token);
        yield user.save();
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    fullNameBangla: user.fullNameBangla,
                    fullNameEnglish: user.fullNameEnglish,
                    contact: user.contact,
                    contactType: user.contactType,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.loginUser = loginUser;
const checkUserExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contact, contactType } = req.body;
        const user = yield user_model_1.User.findOne({ contact, contactType });
        res.status(200).json({
            success: true,
            exists: !!user,
            message: user ? 'User exists' : 'User not found',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
});
exports.checkUserExists = checkUserExists;
// Logout User
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token required',
            });
        }
        const token = authHeader.substring(7);
        // Remove token from user document
        yield user_model_1.User.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, {
            $pull: { tokens: token },
        });
        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during logout',
        });
    }
});
exports.logoutUser = logoutUser;
// Get User Profile
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId).select('-password -tokens');
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি' });
        }
        // পূর্ণ URL সহ ইমেজ পাথ রিটার্ন করুন
        const userData = user.toObject();
        if (userData.profileImage) {
            userData.profileImage = `${req.protocol}://${req.get('host')}${userData.profileImage}`;
        }
        res.status(200).json({
            success: true,
            data: userData,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'সার্ভার ত্রুটি' });
    }
});
exports.getUserProfile = getUserProfile;
// Update User Profile
// Get All Users for Admin
const getAllUsersForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find({ role: 'student' })
            .select('-password -tokens')
            .sort({ createdAt: -1 });
        // Add full URL for profile images
        const usersWithImages = users.map((user) => {
            const userData = user.toObject();
            if (userData.profileImage) {
                userData.profileImage = `${req.protocol}://${req.get('host')}${userData.profileImage}`;
            }
            return userData;
        });
        res.status(200).json({
            success: true,
            data: usersWithImages,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.getAllUsersForAdmin = getAllUsersForAdmin;
// Get User Details with Participations
const getUserDetailsWithParticipations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Get user details
        const user = yield user_model_1.User.findById(userId).select('-password -tokens');
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'User not found' });
        }
        // Get user's participations with populated data
        const participations = yield mongoose_1.default.connection
            .collection('participations')
            .aggregate([
            { $match: { studentId: new mongoose_1.default.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: 'quizId',
                    foreignField: '_id',
                    as: 'quiz',
                },
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'quiz.eventId',
                    foreignField: '_id',
                    as: 'event',
                },
            },
            { $unwind: { path: '$quiz', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$event', preserveNullAndEmptyArrays: true } },
        ])
            .toArray();
        // Add full URL for profile image
        const userData = user.toObject();
        if (userData.profileImage) {
            userData.profileImage = `${req.protocol}://${req.get('host')}${userData.profileImage}`;
        }
        res.status(200).json({
            success: true,
            data: {
                user: userData,
                participations: participations,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.getUserDetailsWithParticipations = getUserDetailsWithParticipations;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let updateData = Object.assign({}, req.body);
        // Explicitly handle dateOfBirth (fix for CastError)
        if (updateData.dateOfBirth) {
            const dateStr = updateData.dateOfBirth;
            if (dateStr && !isNaN(Date.parse(dateStr))) {
                updateData.dateOfBirth = new Date(dateStr);
            }
            else {
                // If invalid date, remove it (since optional)
                delete updateData.dateOfBirth;
            }
        }
        // Handle age as number
        if (updateData.age) {
            updateData.age = parseInt(updateData.age);
            if (isNaN(updateData.age)) {
                return res.status(400).json({ success: false, message: 'অবৈধ বয়স' });
            }
        }
        // Handle boolean fields
        if (updateData.hasSmartphone !== undefined) {
            updateData.hasSmartphone =
                updateData.hasSmartphone === 'true' ||
                    updateData.hasSmartphone === true;
        }
        // Ensure arrays are arrays (multer should handle multiple appends)
        if (updateData.interests && !Array.isArray(updateData.interests)) {
            updateData.interests = [updateData.interests];
        }
        if (updateData.preferredSubjects &&
            !Array.isArray(updateData.preferredSubjects)) {
            updateData.preferredSubjects = [updateData.preferredSubjects];
        }
        // Remove sensitive/locked fields (prevent overwriting)
        delete updateData.password;
        delete updateData.tokens;
        delete updateData.contact;
        delete updateData.contactType;
        delete updateData.role;
        delete updateData.isSuperAdmin;
        delete updateData.isActive;
        // Handle profile image if uploaded
        if (req.file) {
            updateData.profileImage = `/uploads/profile-pics/${req.file.filename}`;
            // Delete old image if exists
            const existingUser = yield user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId).select('profileImage');
            if (existingUser && existingUser.profileImage) {
                const oldImagePath = path_1.default.join(process.cwd(), 'public', existingUser.profileImage.replace('/uploads', '')); // Adjust path if needed
                if (fs_1.default.existsSync(oldImagePath)) {
                    fs_1.default.unlinkSync(oldImagePath);
                }
            }
        }
        const user = yield user_model_1.User.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId, { $set: updateData }, { new: true, runValidators: true }).select('-password -tokens');
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: 'ব্যবহারকারী পাওয়া যায়নি' });
        }
        // Return full URL for image
        const userData = user.toObject();
        if (userData.profileImage) {
            userData.profileImage = `${req.protocol}://${req.get('host')}${userData.profileImage}`;
        }
        res.status(200).json({
            success: true,
            message: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে',
            data: userData,
        });
    }
    catch (error) {
        const message = process.env.NODE_ENV === 'production'
            ? 'সার্ভার ত্রুটি'
            : error.message || 'সার্ভার ত্রুটি';
        res.status(500).json({ success: false, message });
    }
});
exports.updateUserProfile = updateUserProfile;
