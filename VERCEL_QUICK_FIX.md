# ⚡ Quick Fix for Vercel Deployment Crash

## সমস্যা

Vercel এ deploy করার পর "500: This Serverless Function has crashed" error আসছে।

## সমাধান ✅

আমি নিচের changes করেছি:

### 1. `vercel.json` Updated

- ✅ Added `builds` section with `@vercel/node`
- ✅ Added `env` section for NODE_ENV

### 2. `server.js` Restructured

- ✅ Database connection middleware routes এর **আগে** move করা হয়েছে
- ✅ Connection caching add করা হয়েছে serverless এর জন্য
- ✅ `VERCEL` environment variable check করে conditional server start
- ✅ MongoDB connection timeout optimized করা হয়েছে

## এখন আপনাকে কি করতে হবে:

### Step 1: Vercel Dashboard এ Environment Variables Set করুন

1. **Vercel Dashboard** এ যান: https://vercel.com/dashboard
2. আপনার project select করুন
3. **Settings** → **Environment Variables** এ যান
4. নিচের variables add করুন:

#### অত্যাবশ্যক Variables:

```
Name: MONGODB_URI
Value: mongodb+srv://your-username:your-password@your-cluster.mongodb.net/quiz-contest?retryWrites=true&w=majority
Environments: Production, Preview, Development (সব select করুন)
```

```
Name: JWT_SECRET
Value: your_super_secret_jwt_key_at_least_32_characters_long_123456
Environments: Production, Preview, Development
```

```
Name: FRONTEND_URL
Value: https://your-frontend-domain.vercel.app
Environments: Production, Preview, Development
```

```
Name: NODE_ENV
Value: production
Environments: Production, Preview, Development
```

### Step 2: MongoDB Atlas Setup

1. **MongoDB Atlas** এ login করুন: https://cloud.mongodb.com/
2. **Network Access** → **Add IP Address** → `0.0.0.0/0` add করুন
3. **Database Access** → User তৈরি করুন (যদি না থাকে)
4. **Database** → **Connect** → Connection string copy করুন

### Step 3: Push to Git

```bash
git add .
git commit -m "Fix: Configure for Vercel serverless deployment"
git push origin main
```

Vercel automatically detect করবে এবং re-deploy করবে।

### Step 4: Verify Deployment

Deploy complete হলে test করুন:

```bash
# Health check
curl https://your-domain.vercel.app/health

# Expected response:
{
  "status": "success",
  "message": "Server is running",
  "database": "connected"
}
```

## চেকলিস্ট ✅

Deployment এর আগে:

- [ ] Vercel এ `MONGODB_URI` set করেছেন
- [ ] Vercel এ `JWT_SECRET` set করেছেন
- [ ] Vercel এ `FRONTEND_URL` set করেছেন
- [ ] MongoDB Atlas এ `0.0.0.0/0` IP whitelist করেছেন
- [ ] Changes commit ও push করেছেন

## Troubleshooting

### যদি এখনও crash করে:

1. **Vercel Logs Check করুন:**

   - Dashboard → Deployments → Click on deployment → Functions tab
   - Console এ কি error দেখাচ্ছে?

2. **Environment Variables Verify করুন:**

   - Settings → Environment Variables
   - সব variables সঠিকভাবে set করা আছে কিনা check করুন

3. **Re-deploy করুন:**

   ```bash
   vercel --prod --force
   ```

4. **MongoDB Connection Test করুন:**
   - MongoDB Compass দিয়ে connection string test করুন
   - নিশ্চিত করুন username/password সঠিক আছে

## পরিবর্তনের সারাংশ

| File                   | Changes                                                 |
| ---------------------- | ------------------------------------------------------- |
| `vercel.json`          | Added `builds` section, optimized routing               |
| `server.js`            | Restructured middleware order, added connection caching |
| `VERCEL_DEPLOYMENT.md` | Complete deployment guide                               |
| `.gitignore`           | Added Windows reserved device names                     |

## Next Steps

1. Environment variables set করুন (সবচেয়ে গুরুত্বপূর্ণ!)
2. Git push করুন
3. Deployment verify করুন
4. Frontend এ API URL update করুন

---

**Note:** Vercel serverless functions এ file uploads persist হয় না। Production এর জন্য AWS S3 অথবা Cloudinary use করা recommended।
