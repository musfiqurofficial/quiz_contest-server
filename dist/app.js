"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
// Handle double slashes in URLs
app.use((req, res, next) => {
    if (req.url.includes('//')) {
        req.url = req.url.replace(/\/+/g, '/');
        return res.redirect(301, req.url);
    }
    next();
});
// Handle OPTIONS requests
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.status(200).end();
});
// Fallback CORS headers for all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    next();
});
// CORS configuration - Allow all origins
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins
    credentials: false, // Set to false when using wildcard origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
    ],
    optionsSuccessStatus: 200,
}));
// application routes
app.get('/', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.status(200).json({
        project: 'Quiz Contest Backend',
        technology: 'Node.js + TypeScript + Express',
        message: 'Quiz Contest API Server',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        baseUrl: baseUrl,
        endpoints: {
            health: `${baseUrl}/health`,
            api: `${baseUrl}/api/v1`,
            uploads: `${baseUrl}/uploads`,
        },
        availableRoutes: {
            'GET /': 'API Information (this page)',
            'GET /health': 'Health check endpoint',
            'GET /api/v1/*': 'Main API endpoints',
            'GET /uploads/*': 'Static file uploads',
        },
    });
});
app.get('/health', (req, res) => {
    res.status(200).json({
        project: 'Quiz Contest Backend',
        technology: 'TypeScript + Express',
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
app.use('/api/v1', routes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use(globalErrorhandler_1.default);
//Not Found
app.use(notFound_1.default);
exports.default = app;
