// This file is for Vercel deployment
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// Security middleware
app.use(helmet());

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  );
  res.status(200).end();
});

// Fallback CORS headers for all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  );
  next();
});

// CORS configuration
app.use(
  cors({
    origin: '*',
    credentials: false,
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
  }),
);

// Database connection
if (process.env.DATABASE_URL) {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      // Database connected successfully
    })
    .catch((err) => {
      // Failed to connect to database
    });
}

// Basic routes
app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  res.status(200).json({
    project: 'Quiz Contest Backend',
    technology: 'Node.js + Express',
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
    technology: 'Express',
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API routes placeholder
app.get('/api/v1/events', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Events endpoint - Backend is running',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/quizzes', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Quizzes endpoint - Backend is running',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/auth/login', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth endpoint - Backend is running',
    data: { message: 'Login endpoint ready' },
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
