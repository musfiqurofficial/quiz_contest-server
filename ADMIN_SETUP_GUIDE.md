# Admin User Setup Guide

## সমস্যা সমাধান (Problem Solution)

যদি Admin Login এ **"লগইন ব্যর্থ হয়েছে"** error দেখা যায়, তাহলে এই steps follow করুন:

---

## ✅ Solution Steps

### Step 1: Admin User তৈরি করুন (Create Admin User)

Backend directory তে গিয়ে এই command run করুন:

```bash
cd quiz-contest-backend-js
node create-admin-quick.js
```

এটি একটি Admin user create করবে:

- **Email**: `admin@quizcontest.com`
- **Password**: `admin123`
- **Role**: `admin`

### Step 2: Backend Server চালু করুন (Start Backend Server)

```bash
cd quiz-contest-backend-js
npm start
```

অথবা development mode এ:

```bash
npm run dev
```

নিশ্চিত করুন যে server **port 5000** এ চলছে।

### Step 3: Frontend Server চালু করুন (Start Frontend Server)

নতুন terminal এ:

```bash
cd quiz-contest-fr
npm run dev
```

Frontend **port 3000** এ চলবে।

### Step 4: Admin Login করুন

1. Browser এ যান: `http://localhost:3000/admin/login`
2. Enter করুন:
   - **Email**: `admin@quizcontest.com`
   - **Password**: `admin123`
3. "লগইন করুন" button এ click করুন

---

## 🔍 Common Issues এবং Solutions

### Issue 1: "ব্যবহারকারী পাওয়া যায়নি" (User not found)

**কারণ**: Database এ admin user নেই

**সমাধান**:

```bash
cd quiz-contest-backend-js
node create-admin-quick.js
```

### Issue 2: "পাসওয়ার্ড ভুল হয়েছে" (Wrong password)

**কারণ**: Password ভুল দিয়েছেন

**সমাধান**:

- সঠিক password: `admin123`
- অথবা database থেকে user delete করে নতুন করে create করুন

### Issue 3: Backend Server না চলা

**চেক করুন**:

```bash
# Check if server is running
curl http://localhost:5000/health
```

**যদি না চলে**:

```bash
cd quiz-contest-backend-js
npm install
npm start
```

### Issue 4: Database Connection Error

**চেক করুন**: `.env` file এ `DATABASE_URL` আছে কিনা

**`.env` তৈরি করুন**:

```env
DATABASE_URL=mongodb://localhost:27017/quiz-contest
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
```

### Issue 5: CORS Error

**সমাধান**: `server.js` এ CORS configuration check করুন:

```javascript
cors({
  origin: "http://localhost:3000",
  credentials: true,
});
```

---

## 🛠️ Manual Database Setup (যদি script কাজ না করে)

MongoDB Compass বা Mongo Shell ব্যবহার করে:

```javascript
// Connect to database
use quiz-contest

// Create admin user
db.users.insertOne({
  fullNameBangla: "অ্যাডমিন",
  fullNameEnglish: "Admin User",
  contact: "admin@quizcontest.com",
  contactType: "email",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/VfC3wVt6hnV3N4HAu", // admin123
  age: 30,
  gender: "male",
  address: "Admin Address",
  grade: "Admin",
  role: "admin",
  isActive: true,
  tokens: [],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 📝 Testing Admin Login

### Using Browser Console

Admin login page এ F12 press করে Console দেখুন:

```javascript
// You should see these logs:
"Admin login attempt: admin@quizcontest.com";
"Login result: { user: {...}, token: '...' }";
```

### Using Postman/cURL

```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "contact": "admin@quizcontest.com",
    "password": "admin123"
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "...",
      "fullNameBangla": "অ্যাডমিন",
      "fullNameEnglish": "Admin User",
      "contact": "admin@quizcontest.com",
      "role": "admin"
    },
    "token": "..."
  }
}
```

---

## 🔐 Security Notes

**Production এ এই credentials পরিবর্তন করুন!**

1. Strong password ব্যবহার করুন
2. `.env` file এ `JWT_SECRET` change করুন
3. Database এ secure connection ব্যবহার করুন

---

## 📞 যদি এখনও কাজ না করে

1. Backend console logs check করুন
2. Browser console errors check করুন
3. Network tab এ API request/response দেখুন
4. Database connection verify করুন

**Backend Logs দেখতে**:

```bash
cd quiz-contest-backend-js
npm run dev  # Shows detailed logs
```

---

## ✨ কাজ করলে

Admin login successful হলে আপনি redirect হবেন:

```
/admin/dashboard
```

Admin panel এ access পাবেন সব features এ!

---

## Quick Reference

| Item           | Value                                    |
| -------------- | ---------------------------------------- |
| Admin Email    | `admin@quizcontest.com`                  |
| Admin Password | `admin123`                               |
| Backend URL    | `http://localhost:5000`                  |
| Frontend URL   | `http://localhost:3000`                  |
| Admin Login    | `http://localhost:3000/admin/login`      |
| Database       | `mongodb://localhost:27017/quiz-contest` |

---

**সমস্যা সমাধান হয়েছে! 🎉**
