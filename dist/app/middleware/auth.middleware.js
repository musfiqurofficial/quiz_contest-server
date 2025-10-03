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
exports.requireRole = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../modules/User/user.model");
const config_1 = __importDefault(require("../config"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            res
                .status(401)
                .json({ success: false, message: 'Access denied. No token provided.' });
            return;
        }
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        // Check if token exists in user's tokens array
        const user = yield user_model_1.User.findOne({ _id: decoded.userId, tokens: token });
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid token' });
            return;
        }
        req.user = { userId: decoded.userId, role: user.role };
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            // Remove expired token from database
            try {
                const token = (_b = req.header('Authorization')) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', '');
                if (token) {
                    yield user_model_1.User.updateOne({ tokens: token }, { $pull: { tokens: token } });
                }
            }
            catch (dbError) {
                console.error('Error removing expired token:', dbError);
            }
            res.status(401).json({ success: false, message: 'Token expired' });
            return;
        }
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
});
exports.authenticate = authenticate;
const requireRole = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                res
                    .status(401)
                    .json({ success: false, message: 'Authentication required' });
                return;
            }
            if (!roles.includes(req.user.role)) {
                res
                    .status(403)
                    .json({ success: false, message: 'Insufficient permissions' });
                return;
            }
            next();
        }
        catch (error) {
            res.status(403).json({ success: false, message: 'Access denied' });
        }
    });
};
exports.requireRole = requireRole;
