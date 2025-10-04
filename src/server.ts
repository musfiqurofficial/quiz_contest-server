import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

// Connect to MongoDB only if DATABASE_URL is available
if (config.database_url) {
  mongoose
    .connect(config.database_url as string)
    .then(() => {
      // Database connected successfully
    })
    .catch((err) => {
      // Failed to connect to database
    });
} else {
  // No DATABASE_URL provided, skipping database connection
}

// Start server (skip in Vercel production)
if (!process.env.VERCEL) {
  const PORT = config.port || 5000;
  try {
    app.listen(PORT, () => {
      // Server is running
    });
  } catch (error) {
    // Failed to start server
  }
}

// Export the app for Vercel
export default app;

process.on('unhandledRejection', (reason, promise) => {
  // Unhandled Rejection
});
