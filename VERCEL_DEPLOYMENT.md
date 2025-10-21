# Vercel Deployment Guide

## 🚀 Vercel এ Backend Deploy করার সম্পূর্ণ গাইড

### ১. Environment Variables Setup

Vercel dashboard এ যান এবং নিচের environment variables গুলো **অবশ্যই** add করুন:

#### Required Variables (অত্যাবশ্যক):

```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### Optional Variables (ঐচ্ছিক):

```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
```

### ২. MongoDB Atlas Setup

আপনার MongoDB Atlas account এ:

1. **Network Access** এ যান
2. **IP Whitelist** এ `0.0.0.0/0` add করুন (সব IP থেকে access allow করতে)
   - অথবা Vercel এর IP addresses whitelist করুন
3. **Database User** তৈরি করুন proper permissions সহ
4. **Connection String** copy করুন এবং Vercel এ `MONGODB_URI` তে set করুন

### ৩. Vercel Dashboard এ Environment Variables Add করা

1. Vercel Dashboard এ আপনার project এ যান
2. **Settings** → **Environment Variables** এ যান
3. প্রতিটি variable add করুন:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
   - Environment: **Production**, **Preview**, **Development** সব select করুন
4. Save করুন

### ৪. Deploy Process

#### Option A: Git Push (Automatic Deployment)

```bash
git add .
git commit -m "Fix: Vercel serverless deployment configuration"
git push origin main
```

Vercel automatically detect করবে এবং deploy করবে।

#### Option B: Vercel CLI (Manual Deployment)

```bash
# Vercel CLI install করুন (যদি না থাকে)
npm i -g vercel

# Deploy করুন
vercel --prod
```

### ৫. Deployment যাচাই করা

Deploy হওয়ার পর:

1. **Health Check**: `https://your-domain.vercel.app/health`
2. **API Info**: `https://your-domain.vercel.app/api`

Response আসা উচিত:

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-10-21T...",
  "environment": "production",
  "database": "connected"
}
```

### ৬. Common Issues & Solutions

#### Issue 1: "This Serverless Function has crashed"

**Causes:**
- Environment variables missing
- MongoDB connection string ভুল
- MongoDB IP whitelist করা নেই

**Solution:**
1. Vercel Dashboard → Settings → Environment Variables check করুন
2. MongoDB Atlas Network Access check করুন
3. Vercel Logs দেখুন: Dashboard → Deployments → Click deployment → Functions tab

#### Issue 2: "Database connection failed"

**Causes:**
- `MONGODB_URI` environment variable set করা নেই
- MongoDB credentials ভুল
- IP whitelist issue

**Solution:**
1. Environment variable সঠিকভাবে set করা আছে কিনা check করুন
2. MongoDB Atlas এ `0.0.0.0/0` whitelist করুন
3. Connection string এ username/password সঠিক আছে কিনা verify করুন

#### Issue 3: "500 Internal Server Error" কিন্তু logs এ error নেই

**Causes:**
- Server startup সময় error হচ্ছে
- Environment variables load হচ্ছে না

**Solution:**
1. Vercel Dashboard → Deployments → Click on your deployment
2. **Functions** tab এ যান
3. Log output দেখুন
4. Re-deploy করুন: `vercel --prod --force`

### ৭. Environment Variables চেকলিস্ট

Deploy করার আগে নিশ্চিত করুন:

- [ ] `MONGODB_URI` set করা আছে
- [ ] `JWT_SECRET` set করা আছে (minimum 32 characters)
- [ ] `FRONTEND_URL` set করা আছে (আপনার frontend domain)
- [ ] `NODE_ENV=production` set করা আছে
- [ ] MongoDB Atlas এ IP whitelist করা আছে
- [ ] MongoDB user তৈরি করা আছে proper permissions সহ

### ৮. Local Testing

Local এ test করার জন্য:

```bash
# .env file তৈরি করুন
cp env.example .env

# Environment variables edit করুন
# তারপর run করুন
npm start
```

### ৯. Vercel Logs দেখা

Real-time logs দেখার জন্য:

```bash
vercel logs --follow
```

অথবা Vercel Dashboard → Deployments → Click deployment → Functions tab

### ১০. Production URL

Deploy হওয়ার পর আপনার API URL হবে:

```
https://your-project-name.vercel.app
```

এই URL টা আপনার frontend এ `NEXT_PUBLIC_API_URL` এ set করুন।

### 🎉 সফল Deployment এর লক্ষণ

- ✅ Health check endpoint কাজ করছে
- ✅ Database status "connected" দেখাচ্ছে
- ✅ API endpoints থেকে proper response আসছে
- ✅ Vercel logs এ কোন error নেই

### 📞 সহায়তা

যদি এখনও সমস্যা হয়:

1. Vercel Dashboard logs check করুন
2. MongoDB Atlas logs check করুন
3. Environment variables double-check করুন
4. এই repository এ issue create করুন

---

**Important Notes:**

- Vercel serverless functions এর **10 second execution timeout** আছে free plan এ
- Database connection caching ব্যবহার করা হয়েছে performance এর জন্য
- File uploads `/uploads` এ save হবে কিন্তু serverless environment এ persist করবে না - S3/Cloudinary use করা recommended

