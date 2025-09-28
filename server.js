const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Database connection
if (process.env.DATABASE_URL) {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((err) => {
      console.error('Failed to connect to database:', err);
    });
} else {
  console.log('No DATABASE_URL provided, skipping database connection');
}

// Middleware
app.use(express.json());

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
  res.status(200).end();
});

// CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://quiz-contest-fr.vercel.app',
      'https://quiz-contest-fr-git-main.vercel.app',
      'https://api-qc-server-v1.vercel.app',
      'https://api-qc-server-v1.vercel.app/api/v1',
      'https://api-qc-server-v1.vercel.app/api',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
    optionsSuccessStatus: 200,
  }),
);

// Basic routes
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
      'GET /api/v1/test': 'Test API endpoint',
      'GET /api/v1/status': 'API status with database info',
      'GET /api/v1/users': 'Users endpoint',
      'GET /api/v1/events': 'Events endpoint',
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

// API routes
app.get('/api/v1/test', (req, res) => {
  res.status(200).json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/status', (req, res) => {
  res.status(200).json({
    status: 'API is running',
    database:
      mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Add more test endpoints
app.get('/api/v1/users', (req, res) => {
  res.status(200).json({
    message:
      'Users endpoint - This would return users in a real implementation',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/events', (req, res) => {
  res.status(200).json({
    message:
      'Events endpoint - This would return events in a real implementation',
    data: [],
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
    availableEndpoints: {
      'GET /': 'API Information',
      'GET /health': 'Health check',
      'GET /api/v1/test': 'Test API endpoint',
      'GET /api/v1/status': 'API status with database info',
      'GET /api/v1/users': 'Users endpoint',
      'GET /api/v1/events': 'Events endpoint',
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
