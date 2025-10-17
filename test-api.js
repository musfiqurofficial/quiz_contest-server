// Simple API test script
const http = require("http");

// Set environment variables for testing
process.env.NODE_ENV = "development";
process.env.PORT = "5000";
process.env.MONGODB_URI = "mongodb://localhost:27017/quiz-contest-test";
process.env.JWT_SECRET = "test-jwt-secret-key-12345";
process.env.JWT_EXPIRES_IN = "7d";
process.env.FRONTEND_URL = "http://localhost:3000";
process.env.MAX_FILE_SIZE = "5242880";
process.env.RATE_LIMIT_WINDOW_MS = "900000";
process.env.RATE_LIMIT_MAX_REQUESTS = "100";

// Import the app
const app = require("./server");

// Test function
const testAPI = () => {
  console.log("🧪 Testing API endpoints...\n");

  // Test health endpoint
  const healthOptions = {
    hostname: "localhost",
    port: 5000,
    path: "/health",
    method: "GET",
  };

  const healthReq = http.request(healthOptions, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("✅ Health Check Test:");
      console.log("Status:", res.statusCode);
      console.log("Response:", JSON.parse(data));
      console.log("");

      // Test auth endpoints
      testAuthEndpoints();
    });
  });

  healthReq.on("error", (err) => {
    console.log("❌ Health Check Failed:", err.message);
  });

  healthReq.end();
};

// Test authentication endpoints
const testAuthEndpoints = () => {
  console.log("🔐 Testing Authentication endpoints...\n");

  // Test register endpoint
  const registerData = JSON.stringify({
    fullNameBangla: "টেস্ট ব্যবহারকারী",
    fullNameEnglish: "Test User",
    age: 25,
    gender: "male",
    address: "Test Address",
    grade: "12",
    contact: "01712345678",
    contactType: "phone",
    password: "password123",
  });

  const registerOptions = {
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/register",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(registerData),
    },
  };

  const registerReq = http.request(registerOptions, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("✅ Register Test:");
      console.log("Status:", res.statusCode);
      try {
        const response = JSON.parse(data);
        console.log("Response:", response);
        if (response.success) {
          console.log("🎉 User registered successfully!");
          // Test login
          testLogin(response.data.token);
        }
      } catch (e) {
        console.log("Response (raw):", data);
      }
      console.log("");
    });
  });

  registerReq.on("error", (err) => {
    console.log("❌ Register Test Failed:", err.message);
  });

  registerReq.write(registerData);
  registerReq.end();
};

// Test login
const testLogin = (token) => {
  const loginData = JSON.stringify({
    contact: "01712345678",
    password: "password123",
  });

  const loginOptions = {
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/login",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(loginData),
    },
  };

  const loginReq = http.request(loginOptions, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("✅ Login Test:");
      console.log("Status:", res.statusCode);
      try {
        const response = JSON.parse(data);
        console.log("Response:", response);
        if (response.success) {
          console.log("🎉 Login successful!");
          // Test profile endpoint
          testProfile(response.data.token);
        }
      } catch (e) {
        console.log("Response (raw):", data);
      }
      console.log("");
    });
  });

  loginReq.on("error", (err) => {
    console.log("❌ Login Test Failed:", err.message);
  });

  loginReq.write(loginData);
  loginReq.end();
};

// Test profile endpoint
const testProfile = (token) => {
  const profileOptions = {
    hostname: "localhost",
    port: 5000,
    path: "/api/auth/profile",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const profileReq = http.request(profileOptions, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("✅ Profile Test:");
      console.log("Status:", res.statusCode);
      try {
        const response = JSON.parse(data);
        console.log("Response:", response);
        if (response.success) {
          console.log("🎉 Profile retrieved successfully!");
        }
      } catch (e) {
        console.log("Response (raw):", data);
      }
      console.log("");

      // Test quiz endpoints
      testQuizEndpoints(token);
    });
  });

  profileReq.on("error", (err) => {
    console.log("❌ Profile Test Failed:", err.message);
  });

  profileReq.end();
};

// Test quiz endpoints
const testQuizEndpoints = (token) => {
  console.log("📝 Testing Quiz endpoints...\n");

  const quizOptions = {
    hostname: "localhost",
    port: 5000,
    path: "/api/quiz",
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  const quizReq = http.request(quizOptions, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("✅ Quiz List Test:");
      console.log("Status:", res.statusCode);
      try {
        const response = JSON.parse(data);
        console.log("Response:", response);
        if (response.success) {
          console.log("🎉 Quiz list retrieved successfully!");
        }
      } catch (e) {
        console.log("Response (raw):", data);
      }
      console.log("");

      // Test events endpoint
      testEventsEndpoint();
    });
  });

  quizReq.on("error", (err) => {
    console.log("❌ Quiz Test Failed:", err.message);
  });

  quizReq.end();
};

// Test events endpoint
const testEventsEndpoint = () => {
  console.log("📅 Testing Events endpoint...\n");

  const eventsOptions = {
    hostname: "localhost",
    port: 5000,
    path: "/api/events",
    method: "GET",
  };

  const eventsReq = http.request(eventsOptions, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("✅ Events Test:");
      console.log("Status:", res.statusCode);
      try {
        const response = JSON.parse(data);
        console.log("Response:", response);
        if (response.success) {
          console.log("🎉 Events retrieved successfully!");
        }
      } catch (e) {
        console.log("Response (raw):", data);
      }
      console.log("");

      console.log("🎉 All API tests completed!");
      process.exit(0);
    });
  });

  eventsReq.on("error", (err) => {
    console.log("❌ Events Test Failed:", err.message);
    process.exit(1);
  });

  eventsReq.end();
};

// Wait for server to start then test
setTimeout(() => {
  testAPI();
}, 2000);

console.log("🚀 Starting API tests in 2 seconds...");
