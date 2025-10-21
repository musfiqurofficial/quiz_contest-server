const axios = require("axios");

const testAdminLogin = async () => {
  try {
    console.log("Testing admin login...");

    const response = await axios.post(
      "http://localhost:5000/api/v1/auth/login",
      {
        contact: "admin@quizcontest.com",
        password: "admin123",
      }
    );

    console.log("Login successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));

    // Test profile endpoint
    const token = response.data.data.token;
    const profileResponse = await axios.get(
      "http://localhost:5000/api/v1/auth/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Profile fetch successful!");
    console.log("User role:", profileResponse.data.data.role);
  } catch (error) {
    console.error("Error testing admin login:");
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }
  }
};

testAdminLogin();
