# 🚀 Deployment Guide

## Render.com Deployment

### Step 1: Prepare Repository

1. Create a new GitHub repository
2. Push your code to the repository
3. Make sure all files are committed

### Step 2: Render Setup

1. Go to [Render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository

### Step 3: Configure Build Settings

```
Build Command: npm run build
Start Command: npm start
```

### Step 4: Environment Variables

Set these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key-for-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend-domain.com
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 5: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Whitelist Render IP (0.0.0.0/0 for all IPs)
5. Get connection string and use in MONGODB_URI

### Step 6: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Your API will be available at the provided URL

## Environment Variables Reference

| Variable                  | Required | Description        | Example               |
| ------------------------- | -------- | ------------------ | --------------------- |
| `NODE_ENV`                | Yes      | Environment mode   | `production`          |
| `PORT`                    | No       | Server port        | `5000`                |
| `MONGODB_URI`             | Yes      | MongoDB connection | `mongodb+srv://...`   |
| `JWT_SECRET`              | Yes      | JWT secret key     | `your-secret-key`     |
| `JWT_EXPIRES_IN`          | No       | JWT expiration     | `7d`                  |
| `FRONTEND_URL`            | Yes      | Frontend domain    | `https://yourapp.com` |
| `MAX_FILE_SIZE`           | No       | Max file size      | `5242880`             |
| `RATE_LIMIT_WINDOW_MS`    | No       | Rate limit window  | `900000`              |
| `RATE_LIMIT_MAX_REQUESTS` | No       | Max requests       | `100`                 |

## Post-Deployment Checklist

- [ ] API endpoints responding
- [ ] Database connection working
- [ ] Authentication working
- [ ] File uploads working
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Health check endpoint working
- [ ] Error handling working
- [ ] Rate limiting active

## Health Check

Visit: `https://your-app-url.com/health`

Should return:

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

---

**Happy Deploying! 🎉**
