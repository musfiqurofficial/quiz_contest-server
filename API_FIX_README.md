# API সমস্যা সমাধান - সম্পূর্ণ গাইড

## কি কি ঠিক করা হয়েছে? ✅

### 1. **Event API**

- ✅ `isActive`, `createdBy`, `participants`, `quizzes` ফিল্ড যোগ করা হয়েছে
- ✅ PATCH method সাপোর্ট যোগ করা হয়েছে
- ✅ Participant management উন্নত করা হয়েছে

### 2. **Quiz API**

- ✅ `eventId` ফিল্ড যোগ করা হয়েছে
- ✅ PATCH method সাপোর্ট যোগ করা হয়েছে
- ✅ `populate=eventId` কাজ করছে

### 3. **Question API** (সবচেয়ে বড় পরিবর্তন)

- ✅ Frontend-Backend field mapping সম্পূর্ণ করা হয়েছে:
  - `quizId` ↔ `quiz`
  - `text` ↔ `questionText`
  - `questionType` ↔ `type`
  - `MCQ` ↔ `multiple-choice`
  - `Short` ↔ `fill-in-the-blank`
  - `Written` ↔ `essay`
- ✅ Automatic data transformation
- ✅ PATCH method সাপোর্ট
- ✅ Bulk import improved

### 4. **Participation API**

- ✅ `studentId` এবং `user` দুটোই সাপোর্ট করে
- ✅ `quizId` এবং `quiz` দুটোই সাপোর্ট করে
- ✅ Auto-calculation of scores
- ✅ Better response structure

---

## কিভাবে ব্যবহার করবেন?

### Step 1: Server Restart করুন

```bash
cd quiz-contest-backend-js
npm start
```

### Step 2: Frontend থেকে Test করুন

#### Event তৈরি করুন:

```javascript
const eventData = {
  title: "Quiz Contest 2024",
  description: "Annual quiz",
  startDate: "2024-01-01T10:00:00",
  endDate: "2024-01-01T12:00:00",
  isActive: true, // ✅ নতুন ফিল্ড
};

dispatch(createEvent(eventData));
```

#### Quiz তৈরি করুন:

```javascript
const quizData = {
  title: "GK Quiz",
  eventId: "event123", // ✅ এখন কাজ করবে
  duration: 30,
  // ... other fields
};

dispatch(createQuiz(quizData));
```

#### Question তৈরি করুন (Frontend Format):

```javascript
// MCQ
const question = {
  quizId: "quiz123", // ✅ Frontend field
  questionType: "MCQ", // ✅ Frontend type
  text: "What is 2+2?", // ✅ Frontend field
  options: ["1", "2", "3", "4"], // ✅ String array
  correctAnswer: "4",
  marks: 1,
  difficulty: "easy",
};

// Short Answer
const shortQ = {
  quizId: "quiz123",
  questionType: "Short", // ✅ Auto-converts
  text: "Capital of France?",
  correctAnswer: "Paris",
  marks: 2,
};

// Written
const writtenQ = {
  quizId: "quiz123",
  questionType: "Written", // ✅ Auto-converts
  text: "Explain AI",
  wordLimit: 200,
  marks: 5,
};

dispatch(createQuestion(question));
```

#### Participation তৈরি করুন:

```javascript
const participation = {
  studentId: "user123", // ✅ Works now
  quizId: "quiz123", // ✅ Works now
  answers: [
    {
      questionId: "q1",
      selectedOption: "4",
      isCorrect: true,
      marksObtained: 1,
    },
  ],
  totalScore: 15,
  status: "pending",
};

dispatch(createParticipation(participation));
```

---

## Testing

### Manual Testing:

1. Frontend দিয়ে Event, Quiz, Question তৈরি করুন
2. Question import করে দেখুন
3. Quiz participate করুন
4. Admin panel থেকে result review করুন

### Automated Testing:

```bash
# test-api-fixes.js file এ adminId এবং studentId update করুন
# তারপর run করুন:
node test-api-fixes.js
```

---

## Common Issues & Solutions

### Issue 1: "Quiz not found" error

**Solution:** Quiz তৈরি করার সময় `createdBy` field দিতে ভুলবেন না

### Issue 2: Question create করতে পারছি না

**Solution:**

- Quiz তৈরি করেছেন কিনা check করুন
- `quizId` সঠিক আছে কিনা verify করুন
- Question type spelling check করুন (MCQ, Short, Written)

### Issue 3: Participation "already participated" error

**Solution:**

- Database থেকে existing participation delete করুন
- অথবা নতুন quiz তৈরি করুন

### Issue 4: "User ID required" error

**Solution:**

- `studentId` অথবা `user` field দিয়েছেন কিনা check করুন
- Token সঠিক আছে কিনা verify করুন

---

## Database Migration (যদি প্রয়োজন হয়)

যদি আপনার existing data থাকে:

```javascript
// MongoDB shell এ run করুন:

// 1. All events এ isActive যোগ করুন
db.events.updateMany(
  { isActive: { $exists: false } },
  { $set: { isActive: true, participants: [], quizzes: [] } }
);

// 2. Quizzes check করুন
db.quizzes.find({ eventId: { $exists: false } }).count();
```

---

## File Changes Summary

### Modified Files:

1. ✅ `models/Event.js` - নতুন ফিল্ড যোগ
2. ✅ `models/Quiz.js` - eventId যোগ
3. ✅ `routes/event.js` - PATCH method
4. ✅ `routes/quiz.js` - PATCH method
5. ✅ `routes/question.js` - PATCH method
6. ✅ `controllers/eventController.js` - Updated
7. ✅ `controllers/quizController.js` - populate support
8. ✅ `controllers/questionController.js` - Complete transformation
9. ✅ `controllers/participationController.js` - Field mapping

### New Files:

1. 📄 `API_FIXES_SUMMARY.md` - বিস্তারিত documentation
2. 📄 `API_FIX_README.md` - এই file
3. 📄 `test-api-fixes.js` - Testing script

---

## Performance Tips

1. **Indexes**: Already created on important fields
2. **Populate**: শুধু প্রয়োজনে populate করুন
3. **Bulk Operations**: Bulk import ব্যবহার করুন large data এর জন্য

---

## Next Steps

1. ✅ Server restart করুন
2. ✅ Frontend test করুন
3. ✅ Existing data migrate করুন (যদি থাকে)
4. ✅ All features test করুন
5. ✅ Production এ deploy করুন

---

## Support

যদি কোন সমস্যা হয়:

1. **Console check করুন**: Server logs দেখুন
2. **Network tab check করুন**: Request/Response দেখুন
3. **Database check করুন**: Data সঠিকভাবে save হচ্ছে কিনা
4. **API_FIXES_SUMMARY.md পড়ুন**: বিস্তারিত জানতে

---

## সব ঠিক আছে কিনা Quick Check:

```bash
# Server running check
curl http://localhost:5000/api/v1/events

# Event create check
curl -X POST http://localhost:5000/api/v1/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test","startDate":"2024-01-01","endDate":"2024-01-02","isActive":true}'

# Question transformation check
curl http://localhost:5000/api/v1/questions
# Response এ quizId, text, questionType থাকা উচিত
```

---

## শেষ কথা

সব API এখন সঠিকভাবে কাজ করবে। Frontend এবং Backend এর মধ্যে কোন field mismatch থাকবে না।

**Happy Coding! 🚀**
