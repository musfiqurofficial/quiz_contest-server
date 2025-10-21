const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const checkAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.DATABASE_URL || "mongodb://localhost:27017/quiz-contest"
    );
    console.log("Connected to MongoDB");

    // Check all users
    const users = await User.find({});
    console.log("Total users:", users.length);

    users.forEach((user) => {
      console.log("User:", {
        id: user._id,
        contact: user.contact,
        role: user.role,
        isActive: user.isActive,
      });
    });

    // Check admin specifically
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      console.log("Admin found:", {
        contact: admin.contact,
        role: admin.role,
        isActive: admin.isActive,
      });
    } else {
      console.log("No admin user found");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error checking admin:", error);
    process.exit(1);
  }
};

checkAdmin();
