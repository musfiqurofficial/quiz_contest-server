const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

const fixAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.DATABASE_URL || "mongodb://localhost:27017/quiz-contest"
    );
    console.log("Connected to MongoDB");

    // Update admin user to ensure isActive is true
    const admin = await User.findOneAndUpdate(
      { role: "admin" },
      { isActive: true },
      { new: true }
    );

    if (admin) {
      console.log("Admin user updated:", {
        contact: admin.contact,
        role: admin.role,
        isActive: admin.isActive,
      });
    } else {
      console.log("No admin user found to update");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error fixing admin:", error);
    process.exit(1);
  }
};

fixAdmin();
