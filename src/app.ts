/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import path from 'path';

const app: Application = express();

//parsers
app.use(express.json());

app.use(cors({ origin: '*' }));

// application routes

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
      'GET /api/v1/*': 'Main API endpoints',
      'GET /uploads/*': 'Static file uploads',
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

app.use('/api/v1', router);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
