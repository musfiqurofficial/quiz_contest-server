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
const app = require('../dist/app').default || require('../dist/app');

// Export the Express app as a serverless function
module.exports = app;
