const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const debugLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.DATABASE_URL || "mongodb://localhost:27017/quiz-contest"
    );
    console.log("Connected to MongoDB");

    // Check admin user
    const admin = await User.findOne({ contact: "admin@quizcontest.com" });
    console.log("Admin user found:", admin);

    if (admin) {
      console.log("Admin details:", {
        contact: admin.contact,
        role: admin.role,
        isActive: admin.isActive,
        password: admin.password ? "Password exists" : "No password",
      });
    }

    // Test the exact query from login function
    const user = await User.findOne({
      contact: "admin@quizcontest.com",
      isActive: true,
    });
    console.log("User found with isActive filter:", user);

    process.exit(0);
  } catch (error) {
    console.error("Error debugging login:", error);
    process.exit(1);
  }
};

debugLogin();
