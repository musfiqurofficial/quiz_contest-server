import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

// Connect to MongoDB only if DATABASE_URL is available
if (config.database_url) {
  mongoose
    .connect(config.database_url as string)
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((err) => {
      console.error('Failed to connect to database:', err);
    });
} else {
  console.log('No DATABASE_URL provided, skipping database connection');
}

// Start server for development
if (process.env.NODE_ENV !== 'production') {
  const PORT = config.port || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📱 API URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  });
}

// Export the app for Vercel
export default app;
