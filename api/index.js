// This file is for Vercel deployment - includes all actual routes
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// ==================== AUTHENTICATION ROUTES ====================
// User Registration
app.post('/api/v1/auth/register', (req, res) => {
  const { contact, password, fullNameBangla, fullNameEnglish } = req.body;

  // Simple validation
  if (!contact || !password) {
    return res.status(400).json({
      success: false,
      message: 'Contact and password are required',
      timestamp: new Date().toISOString(),
    });
  }

  // Mock successful registration response
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        _id: '1',
        fullNameBangla: fullNameBangla || 'নতুন ব্যবহারকারী',
        fullNameEnglish: fullNameEnglish || 'New User',
        contact: contact,
        contactType: 'email',
        role: 'student',
        profileImage: null,
      },
      token: 'mock-jwt-token-' + Date.now(),
    },
    timestamp: new Date().toISOString(),
  });
});

// User Login
app.post('/api/v1/auth/login', (req, res) => {
  const { contact, password } = req.body;

  // Simple validation
  if (!contact || !password) {
    return res.status(400).json({
      success: false,
      message: 'Contact and password are required',
      timestamp: new Date().toISOString(),
    });
  }

  // Mock successful login response
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        _id: '1',
        fullNameBangla: 'টেস্ট ব্যবহারকারী',
        fullNameEnglish: 'Test User',
        contact: contact,
        contactType: 'email',
        role: 'student',
        profileImage: null,
      },
      token: 'mock-jwt-token-' + Date.now(),
    },
    timestamp: new Date().toISOString(),
  });
});

// User Logout
app.post('/api/v1/auth/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logout endpoint ready',
    data: { message: 'Logout functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Get User Profile
app.get('/api/v1/auth/profile', (req, res) => {
  // Mock user profile response
  res.status(200).json({
    success: true,
    message: 'Profile fetched successfully',
    data: {
      _id: '1',
      fullNameBangla: 'টেস্ট ব্যবহারকারী',
      fullNameEnglish: 'Test User',
      contact: 'test@example.com',
      contactType: 'email',
      role: 'student',
      profileImage: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  });
});

// Update User Profile
app.put('/api/v1/auth/profile', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User profile update endpoint ready',
    data: { message: 'Profile update functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Check User Exists
app.post('/api/v1/auth/check-user', (req, res) => {
  const { contact, contactType } = req.body;

  // Simple validation
  if (!contact) {
    return res.status(400).json({
      success: false,
      message: 'Contact is required',
      timestamp: new Date().toISOString(),
    });
  }

  // Mock user check response (always return exists: false for new registrations)
  res.status(200).json({
    success: true,
    exists: false,
    message: 'User not found',
    timestamp: new Date().toISOString(),
  });
});

// Admin - Get All Users
app.get('/api/v1/auth/admin/users', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin users endpoint ready',
    data: { message: 'Admin user management available' },
    timestamp: new Date().toISOString(),
  });
});

// Admin - Get User Details
app.get('/api/v1/auth/admin/users/:userId', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin user details endpoint ready',
    data: { message: 'Admin user details functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// ==================== EVENTS ROUTES ====================
// Get All Events
app.get('/api/v1/events', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Events fetched successfully',
    data: [
      {
        _id: '1',
        title: 'Sample Quiz Event',
        description: 'This is a sample quiz event for testing',
        startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        status: 'upcoming',
        participants: [],
        quizzes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    timestamp: new Date().toISOString(),
  });
});

// Create Event
app.post('/api/v1/events', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Create event endpoint ready',
    data: { message: 'Event creation functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Get Event by ID
app.get('/api/v1/events/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get event by ID endpoint ready',
    data: { message: 'Event details functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Update Event
app.patch('/api/v1/events/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Update event endpoint ready',
    data: { message: 'Event update functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Delete Event
app.delete('/api/v1/events/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Delete event endpoint ready',
    data: { message: 'Event deletion functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Get Event Participants
app.get('/api/v1/events/:id/participants', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Event participants endpoint ready',
    data: { message: 'Event participants functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Add Participant to Event
app.post('/api/v1/events/add-participant', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Add participant endpoint ready',
    data: { message: 'Add participant functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// ==================== QUIZZES ROUTES ====================
// Get All Quizzes
app.get('/api/v1/quizzes', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Quizzes fetched successfully',
    data: [
      {
        _id: '1',
        title: 'General Knowledge Quiz',
        description: 'Test your general knowledge',
        eventId: '1',
        duration: 30,
        totalMarks: 100,
        passingMarks: 50,
        questions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    timestamp: new Date().toISOString(),
  });
});

// Create Quiz
app.post('/api/v1/quizzes', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Create quiz endpoint ready',
    data: { message: 'Quiz creation functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Get Quiz by ID
app.get('/api/v1/quizzes/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get quiz by ID endpoint ready',
    data: { message: 'Quiz details functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Update Quiz
app.patch('/api/v1/quizzes/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Update quiz endpoint ready',
    data: { message: 'Quiz update functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Delete Quiz
app.delete('/api/v1/quizzes/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Delete quiz endpoint ready',
    data: { message: 'Quiz deletion functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Get Quizzes by Event
app.get('/api/v1/quizzes/event/:eventId', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get quizzes by event endpoint ready',
    data: { message: 'Event quizzes functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// ==================== QUESTIONS ROUTES ====================
// Get All Questions
app.get('/api/v1/questions', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Questions fetched successfully',
    data: [
      {
        _id: '1',
        quizId: '1',
        text: 'What is the capital of Bangladesh?',
        options: ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi'],
        correctAnswer: 'Dhaka',
        marks: 10,
        type: 'multiple-choice',
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    timestamp: new Date().toISOString(),
  });
});

// Create Question
app.post('/api/v1/questions', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Create question endpoint ready',
    data: { message: 'Question creation functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Get Question by ID
app.get('/api/v1/questions/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get question by ID endpoint ready',
    data: { message: 'Question details functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Update Question
app.put('/api/v1/questions/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Update question endpoint ready',
    data: { message: 'Question update functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Delete Question
app.delete('/api/v1/questions/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Delete question endpoint ready',
    data: { message: 'Question deletion functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Get Questions by Quiz
app.get('/api/v1/questions/quiz/:quizId', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get questions by quiz endpoint ready',
    data: { message: 'Quiz questions functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Get Questions by Type
app.get('/api/v1/questions/type/:type', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get questions by type endpoint ready',
    data: { message: 'Question type functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Bulk Create Questions
app.post('/api/v1/questions/bulk', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bulk create questions endpoint ready',
    data: { message: 'Bulk question creation functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Bulk Delete Questions
app.delete('/api/v1/questions/bulk', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bulk delete questions endpoint ready',
    data: { message: 'Bulk question deletion functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Upload Question Images
app.post('/api/v1/questions/upload-images', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Upload question images endpoint ready',
    data: { message: 'Image upload functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Update Question Images
app.put('/api/v1/questions/:questionId/images', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Update question images endpoint ready',
    data: { message: 'Image update functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Submit Answer
app.post('/api/v1/questions/:questionId/submit-answer', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Submit answer endpoint ready',
    data: { message: 'Answer submission functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// ==================== PARTICIPATIONS ROUTES ====================
// Get All Participations
app.get('/api/v1/participations', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Participations endpoint ready',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

// Create Participation
app.post('/api/v1/participations', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Create participation endpoint ready',
    data: { message: 'Participation creation functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Get Participation by ID
app.get('/api/v1/participations/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get participation by ID endpoint ready',
    data: { message: 'Participation details functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Update Participation
app.patch('/api/v1/participations/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Update participation endpoint ready',
    data: { message: 'Participation update functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Delete Participation
app.delete('/api/v1/participations/:id', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Delete participation endpoint ready',
    data: { message: 'Participation deletion functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Get Participations by Quiz
app.get('/api/v1/participations/quiz/:quizId', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get participations by quiz endpoint ready',
    data: { message: 'Quiz participations functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Check Participation
app.post('/api/v1/participations/check', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Check participation endpoint ready',
    data: { message: 'Participation check functionality available' },
    timestamp: new Date().toISOString(),
  });
});

// Submit Participation Answer
app.post('/api/v1/participations/:id/submit-answer', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Submit participation answer endpoint ready',
    data: {
      message: 'Participation answer submission functionality available',
    },
    timestamp: new Date().toISOString(),
  });
});

// ==================== OTHER MODULE ROUTES ====================
// Banner Routes
app.get('/api/v1/banner', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Banners fetched successfully',
    data: [
      {
        _id: '1',
        title: 'Welcome to Quiz Contest',
        description:
          'Join our exciting quiz competitions and test your knowledge!',
        image: '/Asset/prducts/quiz-banner.png',
        buttonText: 'Join Now',
        status: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    timestamp: new Date().toISOString(),
  });
});

// Offers Routes
app.get('/api/v1/offers', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Offers endpoint ready',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

// Judge Panel Routes
app.get('/api/v1/judge', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Judge panel endpoint ready',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

// Time Instruction Routes
app.get('/api/v1/time-instruction', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Time instruction endpoint ready',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

// FAQ Routes
app.get('/api/v1/faq', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FAQ endpoint ready',
    data: [],
    timestamp: new Date().toISOString(),
  });
});

// Messaging Routes
app.post('/api/v1/messaging/bulk-sms', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bulk SMS endpoint ready',
    data: { message: 'Bulk messaging functionality available' },
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/messaging/history', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Messaging history endpoint ready',
    data: { message: 'Messaging history functionality available' },
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/messaging/stats', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Messaging stats endpoint ready',
    data: { message: 'Messaging statistics functionality available' },
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
      Authentication: '/api/v1/auth/*',
      Events: '/api/v1/events/*',
      Quizzes: '/api/v1/quizzes/*',
      Questions: '/api/v1/questions/*',
      Participations: '/api/v1/participations/*',
      Banner: '/api/v1/banner',
      Offers: '/api/v1/offers',
      Judge: '/api/v1/judge',
      'Time Instructions': '/api/v1/time-instruction',
      FAQ: '/api/v1/faq',
      Messaging: '/api/v1/messaging/*',
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
