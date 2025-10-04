"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
// Connect to MongoDB only if DATABASE_URL is available
if (config_1.default.database_url) {
    mongoose_1.default
        .connect(config_1.default.database_url)
        .then(() => {
        // Database connected successfully
    })
        .catch((err) => {
        // Failed to connect to database
    });
}
else {
    // No DATABASE_URL provided, skipping database connection
}
// Start server (skip in Vercel production)
if (!process.env.VERCEL) {
    const PORT = config_1.default.port || 5000;
    try {
        app_1.default.listen(PORT, () => {
            // Server is running
        });
    }
    catch (error) {
        // Failed to start server
    }
}
// Export the app for Vercel
exports.default = app_1.default;
process.on('unhandledRejection', (reason, promise) => {
    // Unhandled Rejection
});
