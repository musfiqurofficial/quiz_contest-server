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

// Handle OPTIONS requests first
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
  res.header('Access-Control-Allow-Credentials', 'true');
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
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// CORS configuration - Allow all origins for now
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
      'GET /api/v1/auth/check-user': 'Check user authentication',
      'POST /api/v1/auth/login': 'User login',
      'POST /api/v1/auth/register': 'User registration',
    },
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

// Auth endpoints
app.get('/api/v1/auth/check-user', (req, res) => {
  res.status(200).json({
    message: 'Check user endpoint - This would check user authentication',
    data: { authenticated: false },
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  res.status(200).json({
    message: 'Login endpoint - This would handle user login',
    data: { success: true, token: 'dummy-token' },
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/v1/auth/register', (req, res) => {
  res.status(200).json({
    message: 'Register endpoint - This would handle user registration',
    data: { success: true, user: { id: 1, email: 'user@example.com' } },
    timestamp: new Date().toISOString(),
  });
});

// Additional endpoints for quiz contest
app.get('/api/v1/banner', (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'Banner endpoint - This would return banner data',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/offers', (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'Offers endpoint - This would return offers data',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/quiz-data', (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'Quiz data endpoint - This would return quiz data',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/judge', (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'Judge endpoint - This would return judge data',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/time-instruction', (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message:
      'Time instruction endpoint - This would return time instruction data',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/faq', (req, res) => {
  res.status(200).json({
    success: true,
    data: [],
    message: 'FAQ endpoint - This would return FAQ data',
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
      'GET /api/v1/auth/check-user': 'Check user authentication',
      'POST /api/v1/auth/login': 'User login',
      'POST /api/v1/auth/register': 'User registration',
      'GET /api/v1/banner': 'Banner data',
      'GET /api/v1/offers': 'Offers data',
      'GET /api/v1/quiz-data': 'Quiz data',
      'GET /api/v1/judge': 'Judge data',
      'GET /api/v1/time-instruction': 'Time instruction data',
      'GET /api/v1/faq': 'FAQ data',
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
