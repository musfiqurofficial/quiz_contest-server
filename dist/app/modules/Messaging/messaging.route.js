"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagingRouter = void 0;
const express_1 = require("express");
const messaging_controller_1 = require("./messaging.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const MessagingRouter = (0, express_1.Router)();
exports.MessagingRouter = MessagingRouter;
// Send bulk message (SMS or WhatsApp) - Admin only
MessagingRouter.post('/bulk-send', auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(['admin']), messaging_controller_1.sendBulkSMS);
// Get messaging history - Admin only
MessagingRouter.get('/history', auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(['admin']), messaging_controller_1.getMessagingHistory);
// Get messaging statistics - Admin only
MessagingRouter.get('/stats', auth_middleware_1.authenticate, (0, auth_middleware_1.requireRole)(['admin']), messaging_controller_1.getMessagingStats);
