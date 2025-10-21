/**
 * API Testing Script for Event, Quiz, Question & Participation fixes
 *
 * Run this file to test all the API fixes:
 * node test-api-fixes.js
 */

const axios = require("axios");

const BASE_URL = "http://localhost:5000/api/v1";
let authToken = "";

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
};

// Test data
let testData = {
  adminId: null,
  studentId: null,
  eventId: null,
  quizId: null,
  questionIds: [],
  participationId: null,
};

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, useAuth = false) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers:
        useAuth && authToken ? { Authorization: `Bearer ${authToken}` } : {},
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
}

// Test functions
async function testEventAPI() {
  log.info("\n=== Testing Event API ===");

  // Test 1: Create Event with new fields
  log.info("Test 1: Creating event with new fields (isActive, createdBy)...");
  const eventData = {
    title: "Test Quiz Contest 2024",
    description: "Testing event creation",
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    isActive: true,
    location: "Online",
    status: "upcoming",
  };

  const createResult = await apiRequest("post", "/events", eventData, true);
  if (createResult.success && createResult.data.success) {
    testData.eventId = createResult.data.data._id;
    log.success(`Event created with ID: ${testData.eventId}`);

    // Check if new fields are present
    if (createResult.data.data.isActive !== undefined) {
      log.success("✓ isActive field present");
    } else {
      log.error("✗ isActive field missing");
    }
  } else {
    log.error(`Failed to create event: ${JSON.stringify(createResult.error)}`);
  }

  // Test 2: Update Event with PATCH method
  log.info("Test 2: Updating event with PATCH method...");
  const updateResult = await apiRequest(
    "patch",
    `/events/${testData.eventId}`,
    { title: "Updated Test Contest" },
    true
  );

  if (updateResult.success && updateResult.data.success) {
    log.success("Event updated successfully with PATCH method");
  } else {
    log.error(`Failed to update event: ${JSON.stringify(updateResult.error)}`);
  }

  // Test 3: Get Event with participants
  log.info("Test 3: Getting event with participants...");
  const getResult = await apiRequest("get", `/events/${testData.eventId}`);
  if (getResult.success && getResult.data.success) {
    const event = getResult.data.data;
    if (event.participants !== undefined && event.quizzes !== undefined) {
      log.success("Event has participants and quizzes arrays");
    } else {
      log.warn("Event missing participants or quizzes arrays");
    }
  }
}

async function testQuizAPI() {
  log.info("\n=== Testing Quiz API ===");

  // Test 1: Create Quiz with eventId
  log.info("Test 1: Creating quiz with eventId...");
  const quizData = {
    title: "Test General Knowledge Quiz",
    description: "Testing quiz creation",
    instructions: "Answer all questions",
    duration: 30,
    totalQuestions: 5,
    marksPerQuestion: 1,
    status: "draft",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdBy: testData.adminId,
    eventId: testData.eventId, // ✅ NEW FIELD
  };

  const createResult = await apiRequest("post", "/quizzes", quizData, true);
  if (createResult.success && createResult.data.success) {
    testData.quizId = createResult.data.data._id;
    log.success(`Quiz created with ID: ${testData.quizId}`);

    if (createResult.data.data.eventId) {
      log.success(`✓ eventId field saved: ${createResult.data.data.eventId}`);
    } else {
      log.warn("⚠ eventId field not saved");
    }
  } else {
    log.error(`Failed to create quiz: ${JSON.stringify(createResult.error)}`);
  }

  // Test 2: Update Quiz with PATCH
  log.info("Test 2: Updating quiz with PATCH method...");
  const updateResult = await apiRequest(
    "patch",
    `/quizzes/${testData.quizId}`,
    { title: "Updated Quiz Title" },
    true
  );

  if (updateResult.success && updateResult.data.success) {
    log.success("Quiz updated successfully with PATCH method");
  } else {
    log.error(`Failed to update quiz: ${JSON.stringify(updateResult.error)}`);
  }

  // Test 3: Get Quiz with populate=eventId
  log.info("Test 3: Getting quiz with populate=eventId...");
  const getResult = await apiRequest(
    "get",
    `/quizzes/${testData.quizId}?populate=eventId`
  );
  if (getResult.success && getResult.data.success) {
    const quiz = getResult.data.data;
    if (quiz.eventId && typeof quiz.eventId === "object") {
      log.success(`✓ eventId populated: ${quiz.eventId.title}`);
    } else {
      log.warn("⚠ eventId not populated");
    }
  }
}

async function testQuestionAPI() {
  log.info("\n=== Testing Question API ===");

  // Test 1: Create MCQ Question (Frontend format)
  log.info("Test 1: Creating MCQ question with frontend format...");
  const mcqData = {
    quizId: testData.quizId, // Frontend field
    questionType: "MCQ", // Frontend type
    text: "What is 2 + 2?", // Frontend field
    options: ["1", "2", "3", "4"], // Frontend format (strings)
    correctAnswer: "4",
    marks: 1,
    difficulty: "easy",
    createdBy: testData.adminId,
  };

  const mcqResult = await apiRequest("post", "/questions", mcqData, true);
  if (mcqResult.success && mcqResult.data.success) {
    testData.questionIds.push(mcqResult.data.data._id);
    log.success(`MCQ Question created: ${mcqResult.data.data._id}`);

    // Verify transformation
    const question = mcqResult.data.data;
    if (question.quizId && question.text && question.questionType === "MCQ") {
      log.success("✓ Frontend format preserved in response");
    } else {
      log.error("✗ Response not in frontend format");
    }
  } else {
    log.error(`Failed to create MCQ: ${JSON.stringify(mcqResult.error)}`);
  }

  // Test 2: Create Short Question
  log.info("Test 2: Creating Short question...");
  const shortData = {
    quizId: testData.quizId,
    questionType: "Short", // Frontend type
    text: "Capital of France?",
    correctAnswer: "Paris",
    marks: 2,
    difficulty: "medium",
    createdBy: testData.adminId,
  };

  const shortResult = await apiRequest("post", "/questions", shortData, true);
  if (shortResult.success && shortResult.data.success) {
    testData.questionIds.push(shortResult.data.data._id);
    log.success(`Short Question created: ${shortResult.data.data._id}`);
  } else {
    log.error(
      `Failed to create Short question: ${JSON.stringify(shortResult.error)}`
    );
  }

  // Test 3: Create Written Question
  log.info("Test 3: Creating Written question...");
  const writtenData = {
    quizId: testData.quizId,
    questionType: "Written", // Frontend type
    text: "Explain photosynthesis",
    wordLimit: 200,
    timeLimit: 15,
    marks: 5,
    difficulty: "hard",
    createdBy: testData.adminId,
  };

  const writtenResult = await apiRequest(
    "post",
    "/questions",
    writtenData,
    true
  );
  if (writtenResult.success && writtenResult.data.success) {
    testData.questionIds.push(writtenResult.data.data._id);
    log.success(`Written Question created: ${writtenResult.data.data._id}`);
  } else {
    log.error(
      `Failed to create Written question: ${JSON.stringify(
        writtenResult.error
      )}`
    );
  }

  // Test 4: Get Questions by Quiz (check transformation)
  log.info("Test 4: Getting questions by quiz...");
  const getResult = await apiRequest(
    "get",
    `/questions/quiz/${testData.quizId}?populate=quizId`
  );
  if (getResult.success && getResult.data.success) {
    const questions = getResult.data.data;
    log.success(`Retrieved ${questions.length} questions`);

    // Check if all are in frontend format
    const allFrontendFormat = questions.every(
      (q) =>
        q.quizId &&
        q.text &&
        q.questionType &&
        ["MCQ", "Short", "Written"].includes(q.questionType)
    );

    if (allFrontendFormat) {
      log.success("✓ All questions in frontend format");
    } else {
      log.error("✗ Some questions not in frontend format");
    }
  }

  // Test 5: Update Question with PATCH
  log.info("Test 5: Updating question with PATCH...");
  const updateResult = await apiRequest(
    "patch",
    `/questions/${testData.questionIds[0]}`,
    { text: "Updated: What is 2 + 2?" },
    true
  );

  if (updateResult.success && updateResult.data.success) {
    log.success("Question updated successfully with PATCH");
  } else {
    log.error(
      `Failed to update question: ${JSON.stringify(updateResult.error)}`
    );
  }

  // Test 6: Bulk Create Questions
  log.info("Test 6: Bulk creating questions...");
  const bulkData = {
    questions: [
      {
        quizId: testData.quizId,
        questionType: "MCQ",
        text: "Bulk Question 1?",
        options: ["A", "B", "C", "D"],
        correctAnswer: "A",
        marks: 1,
        difficulty: "easy",
        createdBy: testData.adminId,
      },
      {
        quizId: testData.quizId,
        questionType: "Short",
        text: "Bulk Question 2?",
        correctAnswer: "Answer",
        marks: 1,
        difficulty: "easy",
        createdBy: testData.adminId,
      },
    ],
  };

  const bulkResult = await apiRequest(
    "post",
    "/questions/bulk",
    bulkData,
    true
  );
  if (bulkResult.success && bulkResult.data.success) {
    log.success(`Bulk created ${bulkResult.data.data.length} questions`);
  } else {
    log.error(`Failed to bulk create: ${JSON.stringify(bulkResult.error)}`);
  }
}

async function testParticipationAPI() {
  log.info("\n=== Testing Participation API ===");

  // Test 1: Check Participation (Frontend format)
  log.info("Test 1: Checking participation with studentId & quizId...");
  const checkData = {
    studentId: testData.studentId, // Frontend field
    quizId: testData.quizId, // Frontend field
  };

  const checkResult = await apiRequest(
    "post",
    "/participations/check",
    checkData
  );
  if (checkResult.success && checkResult.data.success) {
    const data = checkResult.data.data;
    if (data.hasParticipated !== undefined && data.status !== undefined) {
      log.success("✓ Check participation response correct");
    } else {
      log.warn("⚠ Response structure incomplete");
    }
  } else {
    log.error(
      `Failed to check participation: ${JSON.stringify(checkResult.error)}`
    );
  }

  // Test 2: Create Participation (Frontend format)
  log.info("Test 2: Creating participation with studentId & quizId...");
  const participationData = {
    studentId: testData.studentId,
    quizId: testData.quizId,
    answers: [
      {
        questionId: testData.questionIds[0],
        selectedOption: "4",
        isCorrect: true,
        marksObtained: 1,
      },
      {
        questionId: testData.questionIds[1],
        selectedOption: "Paris",
        isCorrect: true,
        marksObtained: 2,
      },
    ],
    totalScore: 3,
    status: "pending",
  };

  const createResult = await apiRequest(
    "post",
    "/participations",
    participationData,
    true
  );
  if (createResult.success && createResult.data.success) {
    testData.participationId = createResult.data.data._id;
    log.success(`Participation created: ${testData.participationId}`);

    // Check auto-calculated fields
    const participation = createResult.data.data;
    if (participation.correctAnswers && participation.obtainedMarks) {
      log.success(
        `✓ Auto-calculated: ${participation.correctAnswers} correct, ${participation.obtainedMarks} marks`
      );
    }
  } else {
    log.error(
      `Failed to create participation: ${JSON.stringify(createResult.error)}`
    );
  }

  // Test 3: Get Participations with populate
  log.info("Test 3: Getting participations with populate...");
  const getResult = await apiRequest(
    "get",
    "/participations?populate=studentId,quizId"
  );
  if (getResult.success && getResult.data.success) {
    const participations = getResult.data.data;
    log.success(`Retrieved ${participations.length} participations`);

    if (
      participations.length > 0 &&
      participations[0].user &&
      participations[0].quiz
    ) {
      log.success("✓ Population working correctly");
    }
  }
}

// Main test runner
async function runAllTests() {
  log.info("Starting API Fix Tests...\n");
  log.warn("Make sure the server is running on http://localhost:5000\n");

  // You need to set these before running
  log.warn(
    "⚠ IMPORTANT: Update testData.adminId and testData.studentId in this file!"
  );

  // TODO: Replace with actual IDs from your database
  testData.adminId = "YOUR_ADMIN_ID_HERE";
  testData.studentId = "YOUR_STUDENT_ID_HERE";

  if (testData.adminId === "YOUR_ADMIN_ID_HERE") {
    log.error(
      "\n✗ Please update adminId and studentId in the test file first!"
    );
    log.info(
      "You can find these IDs from your database or create users first.\n"
    );
    return;
  }

  try {
    // Run all tests
    await testEventAPI();
    await testQuizAPI();
    await testQuestionAPI();
    await testParticipationAPI();

    log.info("\n=== All Tests Completed ===");
    log.success("Check the logs above for any failures");
  } catch (error) {
    log.error(`\nTest execution failed: ${error.message}`);
  }
}

// Run the tests
runAllTests();
