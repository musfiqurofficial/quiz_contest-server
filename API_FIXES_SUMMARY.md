# API Fixes Summary - Event, Quiz, Question & Participation

## সমস্যা ও সমাধান

### 1. Event API Fixes

#### সমস্যা:

- Event Model এ `isActive`, `createdBy`, `participants`, `quizzes` ফিল্ড ছিল না
- Frontend PATCH method ব্যবহার করে কিন্তু backend শুধু PUT সাপোর্ট করত

#### সমাধান:

- ✅ Event Model এ নতুন ফিল্ড যোগ করা হয়েছে:

  - `isActive` (Boolean) - Event active/inactive status
  - `createdBy` (ObjectId ref User) - Event creator
  - `participants` (Array of ObjectId ref User) - Event participants
  - `quizzes` (Array of ObjectId ref Quiz) - Associated quizzes

- ✅ Event Routes এ PATCH method যোগ করা হয়েছে:

```javascript
router.patch("/:id", authenticate, requireAdmin, eventController.updateEvent);
```

---

### 2. Quiz API Fixes

#### সমস্যা:

- Quiz Model এ `eventId` ফিল্ড ছিল না
- Frontend PATCH method ব্যবহার করে কিন্তু backend শুধু PUT সাপোর্ট করত
- `populate=eventId` কাজ করত না

#### সমাধান:

- ✅ Quiz Model এ `eventId` ফিল্ড যোগ করা হয়েছে:

```javascript
eventId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Event",
}
```

- ✅ Quiz Routes এ PATCH method যোগ করা হয়েছে
- ✅ Quiz Controller এ eventId populate সাপোর্ট যোগ করা হয়েছে:
  - `getQuizzes()` - populate=eventId সাপোর্ট
  - `getQuizById()` - populate=eventId সাপোর্ট
  - `getQuizzesByEvent()` - populate=eventId সাপোর্ট

---

### 3. Question API Fixes (সবচেয়ে বড় পরিবর্তন)

#### সমস্যা:

Frontend এবং Backend এর মধ্যে ফিল্ড নামের মিসম্যাচ:

| Frontend Field | Backend Field       |
| -------------- | ------------------- |
| `quizId`       | `quiz`              |
| `text`         | `questionText`      |
| `questionType` | `type`              |
| `MCQ`          | `multiple-choice`   |
| `Short`        | `fill-in-the-blank` |
| `Written`      | `essay`             |

#### সমাধান:

- ✅ Question Controller এ Data Transformation Functions যোগ করা হয়েছে:

**1. Type Mapping Functions:**

```javascript
// Frontend → Backend
mapQuestionTypeToBackend(frontendType)
MCQ → multiple-choice
Short → fill-in-the-blank
Written → essay

// Backend → Frontend
mapQuestionTypeToFrontend(backendType)
multiple-choice → MCQ
fill-in-the-blank → Short
essay → Written
```

**2. Data Transformation Functions:**

```javascript
transformFrontendToBackend(data) {
  quizId → quiz
  text → questionText
  questionType → type
  options (strings) → options (objects with isCorrect)
}

transformBackendToFrontend(data) {
  quiz → quizId
  questionText → text
  type → questionType
  options (objects) → options (strings)
}
```

**3. সব Question API functions আপডেট করা হয়েছে:**

- ✅ `createQuestion()` - Frontend data transform → Backend save → Frontend response
- ✅ `getQuestions()` - Backend data → Frontend transform
- ✅ `getQuestionById()` - Backend data → Frontend transform
- ✅ `updateQuestion()` - Frontend data → Backend update → Frontend response
- ✅ `getQuestionsByQuiz()` - Backend data → Frontend transform
- ✅ `getQuestionsByType()` - Type mapping + Frontend transform
- ✅ `bulkCreateQuestions()` - Batch transform + validation

**4. Populate Support:**

- ✅ `populate=quiz` এবং `populate=quizId` দুটোই কাজ করবে
- ✅ Question Routes এ PATCH method যোগ করা হয়েছে

---

### 4. Participation API Fixes

#### সমস্যা:

- Frontend `studentId` পাঠায় কিন্তু Backend `user` expect করে
- Frontend `quizId` পাঠায় কিন্তু Backend `quiz` expect করে
- `checkParticipation` response structure ঠিক ছিল না

#### সমাধান:

- ✅ **createParticipation()** আপডেট করা হয়েছে:

  - `user` OR `studentId` support করে
  - `quiz` OR `quizId` support করে
  - `answers` array থেকে automatic calculation করে:
    - `correctAnswers`
    - `wrongAnswers`
    - `attemptedQuestions`
    - `obtainedMarks`
  - Auto-populate করে response এ:
    - user details (fullNameEnglish, fullNameBangla, contact, role)
    - quiz details (title, description, duration, totalQuestions)

- ✅ **checkParticipation()** আপডেট করা হয়েছে:
  - `user` OR `studentId` support করে
  - `quiz` OR `quizId` support করে
  - Response structure improved:

```javascript
{
  hasParticipated: boolean,
  exists: boolean,
  status: "pending" | "completed" | "failed" | null,
  participation: object | null
}
```

- ✅ **getParticipations()** আপডেট করা হয়েছে:
  - Query parameters: `user` OR `studentId`
  - Query parameters: `quiz` OR `quizId`
  - Populate: `user`, `studentId`, `quiz`, `quizId` সবই support করে

---

## API Endpoints Overview

### Event APIs

```
GET    /api/events              - Get all events
GET    /api/events/:id          - Get single event
GET    /api/events/:id/participants - Get event participants
POST   /api/events              - Create event (Admin only)
PUT    /api/events/:id          - Update event (Admin only)
PATCH  /api/events/:id          - Update event (Admin only) ✅ NEW
DELETE /api/events/:id          - Delete event (Admin only)
POST   /api/events/add-participant - Add participant
```

### Quiz APIs

```
GET    /api/quizzes                 - Get all quizzes (supports ?populate=eventId)
GET    /api/quizzes/event/:eventId - Get quizzes by event
GET    /api/quizzes/:id/stats      - Get quiz statistics
GET    /api/quizzes/:id            - Get single quiz
POST   /api/quizzes                - Create quiz (Admin only)
PUT    /api/quizzes/:id            - Update quiz (Admin only)
PATCH  /api/quizzes/:id            - Update quiz (Admin only) ✅ NEW
DELETE /api/quizzes/:id            - Delete quiz (Admin only)
```

### Question APIs (with Field Transformation)

```
GET    /api/questions                 - Get all questions
GET    /api/questions/quiz/:quizId   - Get questions by quiz
GET    /api/questions/type/:type     - Get questions by type (MCQ/Short/Written)
GET    /api/questions/:id            - Get single question
POST   /api/questions                - Create question (Admin only)
PUT    /api/questions/:id            - Update question (Admin only)
PATCH  /api/questions/:id            - Update question (Admin only) ✅ NEW
DELETE /api/questions/:id            - Delete question (Admin only)
POST   /api/questions/bulk           - Bulk create questions (Admin only)
DELETE /api/questions/bulk           - Bulk delete questions (Admin only)
POST   /api/questions/:questionId/submit-answer - Submit answer
```

### Participation APIs

```
GET    /api/participations           - Get all participations
GET    /api/participations/quiz/:quizId - Get participations by quiz
GET    /api/participations/:id       - Get single participation
POST   /api/participations           - Create participation
POST   /api/participations/check     - Check if user participated
PUT    /api/participations/:id       - Update participation
DELETE /api/participations/:id       - Delete participation (Admin only)
POST   /api/participations/:id/submit-answer - Submit answer
POST   /api/participations/:id/complete - Complete participation
```

---

## Frontend Usage Examples

### Event Creation

```javascript
const eventData = {
  title: "Quiz Contest 2024",
  description: "Annual quiz competition",
  startDate: "2024-01-01T10:00:00",
  endDate: "2024-01-01T12:00:00",
  isActive: true,
  location: "Online",
};

dispatch(createEvent(eventData));
```

### Quiz Creation with Event

```javascript
const quizData = {
  title: "General Knowledge Quiz",
  eventId: "event123", // ✅ Now supported
  duration: 30,
  totalQuestions: 20,
  // ... other fields
};

dispatch(createQuiz(quizData));
```

### Question Creation (Frontend Format)

```javascript
// MCQ Question
const mcqQuestion = {
  quizId: "quiz123", // ✅ Auto-converts to 'quiz'
  questionType: "MCQ", // ✅ Auto-converts to 'multiple-choice'
  text: "What is 2+2?", // ✅ Auto-converts to 'questionText'
  options: ["1", "2", "3", "4"], // ✅ Auto-converts to option objects
  correctAnswer: "4",
  marks: 1,
  difficulty: "easy",
};

// Short Answer Question
const shortQuestion = {
  quizId: "quiz123",
  questionType: "Short", // ✅ Auto-converts to 'fill-in-the-blank'
  text: "Capital of France?",
  correctAnswer: "Paris",
  marks: 2,
  difficulty: "medium",
};

// Written Question
const writtenQuestion = {
  quizId: "quiz123",
  questionType: "Written", // ✅ Auto-converts to 'essay'
  text: "Explain photosynthesis",
  wordLimit: 200,
  timeLimit: 15,
  marks: 5,
  difficulty: "hard",
};

dispatch(createQuestion(mcqQuestion));
```

### Participation Creation

```javascript
const participationData = {
  studentId: "user123", // ✅ Now supported (OR user)
  quizId: "quiz123", // ✅ Now supported (OR quiz)
  answers: [
    {
      questionId: "q1",
      selectedOption: "4",
      isCorrect: true,
      marksObtained: 1,
    },
    // ... more answers
  ],
  totalScore: 15,
  status: "pending",
};

dispatch(createParticipation(participationData));
```

### Check Participation

```javascript
const checkData = {
  studentId: "user123",        // ✅ Now supported
  quizId: "quiz123"            // ✅ Now supported
};

dispatch(checkParticipation(checkData));

// Response:
{
  hasParticipated: true,
  status: "completed",
  participation: { ... }
}
```

---

## Testing Checklist

- [ ] Event CRUD operations
- [ ] Event participant management
- [ ] Quiz CRUD with eventId
- [ ] Quiz fetch with populate=eventId
- [ ] Question CRUD with all types (MCQ, Short, Written)
- [ ] Question bulk import
- [ ] Question type filtering
- [ ] Participation creation with answers
- [ ] Participation status check
- [ ] Participation listing with filters

---

## Migration Notes

যদি existing data থাকে:

1. **Events**: Manually add `isActive: true` to existing events
2. **Quizzes**: Manually link quizzes to events by adding `eventId`
3. **Questions**: No migration needed - transformation handles it automatically
4. **Participations**: No changes needed

---

## Performance Improvements

- Auto-populate added for better data fetching
- Indexes already exist on important fields
- Batch operations supported for questions

---

## সব ঠিক আছে কিনা চেক করার জন্য:

1. Server restart করুন: `npm start`
2. Frontend থেকে test করুন:
   - Event create/update/delete
   - Quiz create with eventId
   - Question create/update (all types)
   - Participation create
   - Check participation status

যদি কোন error আসে, console check করুন এবং জানান।
