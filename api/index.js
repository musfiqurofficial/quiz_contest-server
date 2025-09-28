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

// CORS configuration - Allow specific origins
const allowedOrigins = [
  'https://qc-client-beige.vercel.app',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://api-qc-server-v1.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
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
    technology: 'Node.js + Express',
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

// Users endpoint
app.get('/api/v1/users', (req, res) => {
  res.status(200).json({
    message:
      'Users endpoint - This would return users in a real implementation',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

// Events endpoint
app.get('/api/v1/events', (req, res) => {
  res.status(200).json({
    message:
      'Events endpoint - This would return events in a real implementation',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

// Check user endpoint
app.get('/api/v1/check-user', (req, res) => {
  res.status(200).json({
    message: 'Check user endpoint - This would check user authentication',
    data: { authenticated: false },
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
      'GET /api/v1/check-user': 'Check user endpoint',
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
