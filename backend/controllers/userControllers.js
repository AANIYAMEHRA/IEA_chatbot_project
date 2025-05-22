import sendMail from "../middlewares/sendMail.js";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Create OTP token
    const otpToken = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        otp 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: "5m" }
    );

    try {
      // Send OTP email
      await sendMail(email, "ChatBot OTP Verification", otp);
      
      res.status(200).json({
        message: "OTP sent to your email",
        otpToken,
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again later.",
        error: emailError.message
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "An error occurred. Please try again.",
      error: error.message
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { otp, otpToken } = req.body;

    if (!otp || !otpToken) {
      return res.status(400).json({
        message: "OTP and token are required",
      });
    }

    // Verify OTP token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (decoded.otp !== parseInt(otp)) {
      return res.status(400).json({
        message: "Invalid OTP. Please try again.",
      });
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate authentication token
    const authToken = jwt.sign(
      { 
        _id: user._id,
        email: user.email 
      }, 
      process.env.JWT_SECRET,
      { expiresIn: "5d" }
    );

    res.status(200).json({
      message: "Logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
      },
      token: authToken,
    });
  } catch (error) {
    console.error("Verification error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({
        message: "Invalid or expired OTP token",
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one.",
      });
    }
    res.status(500).json({
      message: "An error occurred. Please try again.",
    });
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      _id: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};
