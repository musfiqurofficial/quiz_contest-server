const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    const dbUrl =
      process.env.DATABASE_URL || "mongodb://localhost:27017/quiz-contest";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB");

    // Define User schema inline
    const userSchema = new mongoose.Schema(
      {
        fullNameBangla: String,
        fullNameEnglish: String,
        contact: { type: String, unique: true },
        contactType: String,
        password: String,
        age: Number,
        gender: String,
        address: String,
        grade: String,
        role: { type: String, enum: ["student", "admin"], default: "student" },
        isActive: { type: Boolean, default: true },
        tokens: [String],
      },
      { timestamps: true }
    );

    const User = mongoose.models.User || mongoose.model("User", userSchema);

    // Admin credentials
    const adminEmail = "admin@quizcontest.com";
    const adminPassword = "admin123";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ contact: adminEmail });
    if (existingAdmin) {
      console.log("\n⚠️  Admin user already exists!");
      console.log("📧 Email:", adminEmail);
      console.log("🔑 Password:", adminPassword);
      console.log("👤 Role:", existingAdmin.role);
      console.log(
        "\nℹ️  If you need to reset password, delete this user from database first.\n"
      );
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = new User({
      fullNameBangla: "অ্যাডমিন",
      fullNameEnglish: "Admin User",
      contact: adminEmail,
      contactType: "email",
      password: hashedPassword,
      age: 30,
      gender: "male",
      address: "Admin Address",
      grade: "Admin",
      role: "admin",
      isActive: true,
      tokens: [],
    });

    await admin.save();

    console.log("\n✅ Admin user created successfully!\n");
    console.log("════════════════════════════════════");
    console.log("📧 Email:    ", adminEmail);
    console.log("🔑 Password: ", adminPassword);
    console.log("👤 Role:     ", "admin");
    console.log("════════════════════════════════════\n");
    console.log("You can now login at: /admin/login\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin user:");
    if (error.code === 11000) {
      console.error("Email already exists in database!");
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
};

createAdminUser();
