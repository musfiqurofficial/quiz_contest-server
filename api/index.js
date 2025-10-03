const mongoose = require('mongoose');

// Connect to MongoDB
if (process.env.DATABASE_URL) {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((err) => {
      console.error('Failed to connect to database:', err);
    });
}

// Import the Express app
let app;
try {
  app = require('../dist/app').default || require('../dist/app');
} catch (error) {
  console.error('Error importing app:', error);
  // Fallback to a simple response
  app = require('express')();
  app.get('*', (req, res) => {
    res.status(200).json({
      message: 'Quiz Contest Backend API',
      status: 'running',
      error: 'App import failed',
    });
  });
}

// Export the Express app as a serverless function
module.exports = app;
