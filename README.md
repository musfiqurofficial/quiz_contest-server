# Quiz Contest Backend API

A professional Node.js backend API for quiz contest management system built with Express.js and MongoDB.

## 🚀 Features

- **User Management**: Registration, login, profile management
- **Quiz System**: Create, manage, and participate in quizzes
- **Question Management**: Multiple choice, true/false, fill-in-the-blank questions
- **Real-time Participation**: Track quiz attempts and results
- **Admin Panel**: Full administrative control
- **File Upload**: Profile pictures and question images
- **Security**: JWT authentication, rate limiting, input validation
- **Professional Structure**: Clean, scalable, and maintainable code

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Environment**: dotenv

## 📁 Project Structure

```
quiz-contest-backend-js/
├── config/                 # Configuration files
├── controllers/           # Route controllers
│   └── authController.js  # Authentication logic
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication middleware
│   ├── errorHandler.js   # Error handling
│   ├── notFound.js       # 404 handler
│   └── validation.js     # Input validation
├── models/               # Database models
│   ├── User.js          # User schema
│   ├── Quiz.js          # Quiz schema
│   ├── Question.js      # Question schema
│   ├── Participation.js # Participation schema
│   └── Event.js         # Event schema
├── routes/               # API routes
│   ├── auth.js          # Authentication routes
│   ├── user.js          # User routes
│   ├── quiz.js          # Quiz routes
│   ├── question.js      # Question routes
│   ├── event.js         # Event routes
│   └── participation.js # Participation routes
├── utils/                # Utility functions
│   └── response.js      # Response helpers
├── uploads/              # File upload directory
│   ├── profile-pics/    # Profile pictures
│   └── question-images/ # Question images
├── server.js            # Main server file
├── package.json         # Dependencies
└── README.md           # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd quiz-contest-backend-js
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/quiz-contest
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   ```

4. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Users

- `GET /api/users/all` - Get all users (Admin only)

### Quizzes

- `GET /api/quiz` - Get all quizzes
- `GET /api/quiz/:id` - Get single quiz
- `POST /api/quiz` - Create quiz (Admin only)

### Questions

- `GET /api/questions/quiz/:quizId` - Get questions for quiz
- `POST /api/questions` - Create question (Admin only)

### Participation

- `POST /api/participation/start/:quizId` - Start quiz
- `POST /api/participation/submit/:quizId` - Submit quiz
- `GET /api/participation/my-participations` - Get user participations

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event

## 🔧 Configuration

### Environment Variables

| Variable         | Description               | Default                 |
| ---------------- | ------------------------- | ----------------------- |
| `NODE_ENV`       | Environment mode          | `development`           |
| `PORT`           | Server port               | `5000`                  |
| `MONGODB_URI`    | MongoDB connection string | Required                |
| `JWT_SECRET`     | JWT secret key            | Required                |
| `JWT_EXPIRES_IN` | JWT expiration time       | `7d`                    |
| `MAX_FILE_SIZE`  | Max file upload size      | `5242880` (5MB)         |
| `FRONTEND_URL`   | Frontend URL for CORS     | `http://localhost:3000` |

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Express Validator for data validation
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **File Upload Security**: File type and size validation

## 🚀 Deployment

### Render Deployment

1. **Connect your GitHub repository to Render**
2. **Create a new Web Service**
3. **Configure build settings:**
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. **Set environment variables in Render dashboard**
5. **Deploy!**

### Environment Variables for Production

Make sure to set these in your deployment platform:

- `NODE_ENV=production`
- `MONGODB_URI=your-production-mongodb-url`
- `JWT_SECRET=your-production-jwt-secret`
- `FRONTEND_URL=your-frontend-url`

## 📊 Database Schema

### User Schema

- Personal information (name, age, gender, address)
- Education details (grade, institution)
- Contact information
- Authentication data (password, tokens)
- Role-based access (student, admin, super-admin)

### Quiz Schema

- Quiz details (title, description, instructions)
- Time settings (duration, start/end time)
- Question configuration
- Scoring system
- Access control

### Question Schema

- Question content and images
- Multiple choice options
- Correct answers and explanations
- Difficulty levels and categories
- Statistics tracking

### Participation Schema

- User and quiz references
- Answer tracking
- Scoring and timing
- Status management

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build the application
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team

---

**Built with ❤️ for quiz contest management**
# quiz_contest-server
