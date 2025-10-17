# Quiz Contest Backend API Endpoints

This document lists all available API endpoints in the quiz-contest-backend-js application.

## Base URL

```
http://localhost:5000/api
```

## Authentication Endpoints

### POST /auth/register

Register a new user

- **Body**: User registration data
- **Response**: User data with token

### POST /auth/login

Login user

- **Body**: { contact, password }
- **Response**: User data with token

### POST /auth/logout

Logout user (requires authentication)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

### GET /auth/profile

Get current user profile (requires authentication)

- **Headers**: Authorization: Bearer <token>
- **Response**: User profile data

### PUT /auth/profile

Update user profile (requires authentication)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated user data
- **Response**: Updated user profile

### PUT /auth/change-password

Change user password (requires authentication)

- **Headers**: Authorization: Bearer <token>
- **Body**: { currentPassword, newPassword }
- **Response**: Success message

## User Management Endpoints

### GET /users

Get all users (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Query**: ?page=1&limit=10&role=student
- **Response**: Paginated user list

### GET /users/:id

Get user by ID (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: User data

### PUT /users/:id

Update user (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated user data
- **Response**: Updated user data

### DELETE /users/:id

Delete user (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

## Event Management Endpoints

### GET /events

Get all events

- **Query**: ?status=active&populate=quizzes
- **Response**: Event list

### GET /events/:id

Get event by ID

- **Response**: Event details

### GET /events/:id/participants

Get event participants

- **Response**: Event with participants list

### POST /events

Create event (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Event data
- **Response**: Created event

### PUT /events/:id

Update event (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated event data
- **Response**: Updated event

### DELETE /events/:id

Delete event (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

### POST /events/add-participant

Add participant to event

- **Headers**: Authorization: Bearer <token>
- **Body**: { eventId, userId }
- **Response**: Event with updated participants

## Quiz Management Endpoints

### GET /quiz

Get all quizzes

- **Query**: ?status=published&populate=questions&createdBy=userId
- **Response**: Quiz list

### GET /quiz/:id

Get quiz by ID

- **Query**: ?populate=questions
- **Response**: Quiz details

### GET /quiz/event/:eventId

Get quizzes by event

- **Query**: ?populate=questions
- **Response**: Event quizzes

### GET /quiz/:id/stats

Get quiz statistics

- **Response**: Quiz statistics

### POST /quiz

Create quiz (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Quiz data
- **Response**: Created quiz

### PUT /quiz/:id

Update quiz (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated quiz data
- **Response**: Updated quiz

### DELETE /quiz/:id

Delete quiz (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

## Question Management Endpoints

### GET /questions

Get all questions

- **Query**: ?quiz=quizId&type=multiple-choice&difficulty=easy&status=published&populate=quiz
- **Response**: Question list

### GET /questions/:id

Get question by ID

- **Query**: ?populate=quiz
- **Response**: Question details

### GET /questions/quiz/:quizId

Get questions by quiz

- **Query**: ?populate=quiz
- **Response**: Quiz questions

### GET /questions/type/:type

Get questions by type

- **Query**: ?quiz=quizId&populate=quiz
- **Response**: Questions of specified type

### POST /questions/:questionId/submit-answer

Submit answer for a question

- **Body**: { answer, userId }
- **Response**: Answer result

### POST /questions

Create question (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Question data
- **Response**: Created question

### PUT /questions/:id

Update question (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated question data
- **Response**: Updated question

### DELETE /questions/:id

Delete question (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

### POST /questions/bulk

Bulk create questions (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: { questions: [...] }
- **Response**: Created questions

### DELETE /questions/bulk

Bulk delete questions (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: { questionIds: [...] }
- **Response**: Deletion result

## Participation Management Endpoints

### GET /participation

Get all participations

- **Query**: ?user=userId&quiz=quizId&status=completed&populate=user,quiz
- **Response**: Participation list

### GET /participation/:id

Get participation by ID

- **Query**: ?populate=user,quiz,answers.question
- **Response**: Participation details

### GET /participation/quiz/:quizId

Get participations by quiz

- **Query**: ?status=completed&populate=user
- **Response**: Quiz participations

### POST /participation/check

Check if user participated in quiz

- **Body**: { user, quiz }
- **Response**: Participation status

### POST /participation

Create participation (requires authentication)

- **Headers**: Authorization: Bearer <token>
- **Body**: { user, quiz, startTime }
- **Response**: Created participation

### PUT /participation/:id

Update participation (requires authentication)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated participation data
- **Response**: Updated participation

### DELETE /participation/:id

Delete participation (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

### POST /participation/:id/submit-answer

Submit answer for participation

- **Headers**: Authorization: Bearer <token>
- **Body**: { questionId, answer }
- **Response**: Answer result

### POST /participation/:id/complete

Complete participation

- **Headers**: Authorization: Bearer <token>
- **Response**: Final participation summary

## Banner Management Endpoints

### GET /banner

Get approved banners (Public)

- **Response**: Approved banner list

### POST /banner

Create banner (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Banner data
- **Response**: Created banner

### GET /banner/admin

Get all banners (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Query**: ?status=approved
- **Response**: Banner list

### GET /banner/admin/:id

Get banner by ID (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Banner details

### PUT /banner/:id

Update banner (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated banner data
- **Response**: Updated banner

### DELETE /banner/:id

Delete banner (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

## Offer Management Endpoints

### GET /offers

Get approved offers (Public)

- **Response**: Approved offer list

### POST /offers

Create offer (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Offer data
- **Response**: Created offer

### GET /offers/admin

Get all offers (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Query**: ?status=approved
- **Response**: Offer list

### GET /offers/admin/:id

Get offer by ID (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Offer details

### PUT /offers/:id

Update offer (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated offer data
- **Response**: Updated offer

### DELETE /offers/:id

Delete offer (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

## Judge Panel Management Endpoints

### GET /judge

Get all judge panels (Public)

- **Response**: Judge panel list

### GET /judge/:id

Get judge panel by ID (Public)

- **Response**: Judge panel details

### GET /judge/panel/:panel

Get judge panel by panel name (Public)

- **Response**: Judge panel details

### POST /judge

Create judge panel (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Judge panel data
- **Response**: Created judge panel

### PUT /judge/:id

Update judge panel (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated judge panel data
- **Response**: Updated judge panel

### DELETE /judge/:id

Delete judge panel (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

## Time Instruction Management Endpoints

### GET /time-instruction

Get latest time instruction (Public)

- **Response**: Latest time instruction

### POST /time-instruction

Create time instruction (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Time instruction data
- **Response**: Created time instruction

### GET /time-instruction/admin

Get all time instructions (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Time instruction list

### GET /time-instruction/admin/:id

Get time instruction by ID (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Time instruction details

### PUT /time-instruction/:id

Update time instruction (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated time instruction data
- **Response**: Updated time instruction

### DELETE /time-instruction/:id

Delete time instruction (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

## FAQ Management Endpoints

### GET /faq

Get approved FAQs (Public)

- **Response**: Approved FAQ list

### GET /faq/latest

Get latest FAQ (Public)

- **Response**: Latest FAQ

### POST /faq

Create FAQ (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: FAQ data
- **Response**: Created FAQ

### GET /faq/admin

Get all FAQs (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Query**: ?status=approved
- **Response**: FAQ list

### GET /faq/admin/:id

Get FAQ by ID (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: FAQ details

### PUT /faq/:id

Update FAQ (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: Updated FAQ data
- **Response**: Updated FAQ

### DELETE /faq/:id

Delete FAQ (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

## Messaging Management Endpoints

### POST /messaging/bulk-sms

Send bulk message (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: { userIds: [...], message: "...", messageType: "sms|whatsapp|email" }
- **Response**: Message sending result

### GET /messaging/history

Get messaging history (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Query**: ?page=1&limit=10&messageType=sms&status=sent
- **Response**: Paginated message history

### GET /messaging/stats

Get messaging statistics (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Messaging statistics

### GET /messaging/:id

Get message by ID (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Message details

### PUT /messaging/:id/status

Update message status (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Body**: { status, deliveryStatus }
- **Response**: Updated message

### DELETE /messaging/:id

Delete message (Admin only)

- **Headers**: Authorization: Bearer <token>
- **Response**: Success message

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

API requests are rate-limited to 100 requests per 15 minutes per IP address.

## File Uploads

For file uploads (images, documents), use multipart/form-data content type and the appropriate upload endpoints.
