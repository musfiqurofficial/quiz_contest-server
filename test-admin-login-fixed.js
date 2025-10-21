const axios = require("axios");

// Test configuration
const API_BASE_URL = process.env.API_URL || "http://localhost:5000/api/v1";
const ADMIN_EMAIL = "admin@quizcontest.com";
const ADMIN_PASSWORD = "admin123";

console.log("🧪 Testing Admin Login...\n");
console.log("API URL:", API_BASE_URL);
console.log("Admin Email:", ADMIN_EMAIL);
console.log("─".repeat(50));

// Test admin login
async function testAdminLogin() {
  try {
    console.log("\n📤 Sending login request...");

    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      contact: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    console.log("\n✅ Login Successful!\n");
    console.log("Response Status:", response.status);
    console.log("Response Data:", JSON.stringify(response.data, null, 2));

    // Verify response structure
    if (response.data.success) {
      const { user, token } = response.data.data;

      console.log("\n📊 Verification:");
      console.log("─".repeat(50));
      console.log("✓ Success:", response.data.success ? "YES" : "NO");
      console.log("✓ User ID (_id):", user._id ? "YES ✓" : "NO ✗");
      console.log("✓ User ID (id):", user.id ? "YES ✓" : "NO ✗");
      console.log("✓ Full Name (Bangla):", user.fullNameBangla || "Missing");
      console.log("✓ Full Name (English):", user.fullNameEnglish || "Missing");
      console.log("✓ Contact:", user.contact || "Missing");
      console.log("✓ Role:", user.role || "Missing");
      console.log(
        "✓ Token:",
        token ? `${token.substring(0, 20)}...` : "Missing"
      );
      console.log("─".repeat(50));

      // Check if user is admin
      if (user.role === "admin") {
        console.log("\n🎉 ADMIN LOGIN TEST PASSED!");
        console.log("✓ User has admin role");
        console.log("✓ Can proceed to admin dashboard");
      } else {
        console.log("\n⚠️  WARNING: User is not admin!");
        console.log("Role:", user.role);
      }

      return true;
    } else {
      console.log("\n❌ Login failed: success = false");
      return false;
    }
  } catch (error) {
    console.log("\n❌ Login Failed!\n");

    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Error Message:", error.response.data.message);
      console.log("Error Data:", JSON.stringify(error.response.data, null, 2));

      console.log("\n🔍 Possible Issues:");
      if (error.response.status === 404) {
        console.log("❌ Admin user not found in database");
        console.log("💡 Solution: Run 'npm run create-admin'");
      } else if (error.response.status === 400) {
        console.log("❌ Password incorrect");
        console.log("💡 Solution: Check password or recreate admin user");
      } else if (error.response.status === 500) {
        console.log("❌ Server error");
        console.log("💡 Solution: Check backend logs and database connection");
      } else {
        console.log("❌ Unknown error");
        console.log("💡 Solution: Check backend server is running");
      }
    } else if (error.request) {
      console.log("❌ No response from server");
      console.log(
        "💡 Solution: Make sure backend server is running on port 5000"
      );
      console.log("\nRun: cd quiz-contest-backend-js && npm start");
    } else {
      console.log("Error:", error.message);
    }

    return false;
  }
}

// Test profile endpoint with token
async function testProfileEndpoint(token) {
  try {
    console.log("\n\n📤 Testing Profile Endpoint...");

    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("\n✅ Profile Fetch Successful!\n");
    console.log("User Data:", JSON.stringify(response.data.data, null, 2));

    return true;
  } catch (error) {
    console.log("\n❌ Profile Fetch Failed!");
    if (error.response) {
      console.log("Error:", error.response.data.message);
    }
    return false;
  }
}

// Run tests
async function runTests() {
  console.log("\n" + "═".repeat(50));
  console.log("  ADMIN LOGIN TEST SUITE");
  console.log("═".repeat(50));

  const loginSuccess = await testAdminLogin();

  if (!loginSuccess) {
    console.log("\n\n🛠️  NEXT STEPS:");
    console.log("1. Create admin user: npm run create-admin");
    console.log("2. Start backend: npm start");
    console.log("3. Run this test again: node test-admin-login-fixed.js");
    process.exit(1);
  }

  console.log("\n\n" + "═".repeat(50));
  console.log("  ALL TESTS PASSED! ✅");
  console.log("═".repeat(50));
  console.log("\nYou can now login to admin panel:");
  console.log("URL: http://localhost:3000/admin/login");
  console.log("Email:", ADMIN_EMAIL);
  console.log("Password:", ADMIN_PASSWORD);
  console.log("\n");
}

// Start tests
runTests();
