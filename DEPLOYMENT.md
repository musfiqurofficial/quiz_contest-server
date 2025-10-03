# Render Deployment Guide

## Quick Setup for Render

### 1. Render Dashboard Settings

When creating a new Web Service on Render, use these settings:

- **Environment**: Node
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Publish Directory**: Leave empty (not needed for Node.js apps)

### 2. Environment Variables

Add these environment variables in Render dashboard:

- `NODE_ENV` = `production`
- `PORT` = `10000` (or leave empty, Render will auto-assign)
- `DATABASE_URL` = Your MongoDB connection string
- Any other environment variables your app needs

### 3. Node.js Version

The app is configured to use Node.js 18+ (specified in package.json engines field).

## Troubleshooting

### If you get "Publish directory does not exist" error:

1. Make sure **Publish Directory** is left empty in Render settings
2. For Node.js apps, you don't need a publish directory
3. The build command should be: `npm install && npm run build`
4. The start command should be: `npm start`

### If build fails:

1. Check that all dependencies are in `dependencies` (not `devDependencies`)
2. Make sure TypeScript is properly configured
3. Verify that `tsconfig.json` has correct `outDir` setting

### If app doesn't start:

1. Check that `main` field in package.json points to `./dist/server.js`
2. Verify that `start` script runs `node ./dist/server.js`
3. Check environment variables are set correctly

## Files Structure

```
quiz-contest-bcknd/
├── src/                 # TypeScript source files
├── dist/               # Compiled JavaScript files (generated)
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── render.yaml         # Render deployment config
└── .renderignore       # Files to exclude from deployment
```

## Build Process

1. `npm install` - Install dependencies
2. `npm run build` - Compile TypeScript to JavaScript
3. `npm start` - Start the application

The compiled files go to the `dist/` directory, and the app starts from `dist/server.js`.
