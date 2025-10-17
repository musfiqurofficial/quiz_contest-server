const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Register user
const register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      fullNameBangla,
      fullNameEnglish,
      fatherName,
      motherName,
      dateOfBirth,
      age,
      gender,
      union,
      postOffice,
      upazila,
      district,
      address,
      grade,
      institutionName,
      institutionAddress,
      rollId,
      contact,
      contactType,
      parentContact,
      whatsappNumber,
      bloodGroup,
      specialNeeds,
      hasSmartphone,
      internetUsage,
      interests,
      preferredSubjects,
      futureGoals,
      password,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ contact });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this contact number already exists",
      });
    }

    // Create new user
    const user = new User({
      fullNameBangla,
      fullNameEnglish,
      fatherName,
      motherName,
      dateOfBirth,
      age,
      gender,
      union,
      postOffice,
      upazila,
      district,
      address,
      grade,
      institutionName,
      institutionAddress,
      rollId,
      contact,
      contactType,
      parentContact,
      whatsappNumber,
      bloodGroup,
      specialNeeds,
      hasSmartphone,
      internetUsage,
      interests: Array.isArray(interests)
        ? interests
        : [interests].filter(Boolean),
      preferredSubjects: Array.isArray(preferredSubjects)
        ? preferredSubjects
        : [preferredSubjects].filter(Boolean),
      futureGoals,
      password,
    });

    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: user.getPublicProfile(),
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { contact, password } = req.body;

    // Find user by contact
    const user = await User.findOne({ contact });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid contact number or password",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact admin.",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid contact number or password",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: user.getPublicProfile(),
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const user = req.user;
    const token = req.token;

    // Remove token from user's tokens array
    await user.removeToken(token);

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.password;
    delete updates.tokens;
    delete updates.role;
    delete updates.isSuperAdmin;
    delete updates.isActive;

    // Update user
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Password change failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
};
