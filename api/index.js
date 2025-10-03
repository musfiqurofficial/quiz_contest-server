const mongoose = require('mongoose');
const app = require('../dist/app');

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

// Export the Express app as a serverless function
module.exports = app;
